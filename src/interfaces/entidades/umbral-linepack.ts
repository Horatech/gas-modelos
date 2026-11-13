/**
 * Umbrales de presión por extremo de un tramo de linepack (LO/LOLO/HI/HIHI).
 *
 * Es un juego **paralelo** a los límites del iFIX y a los `limiteL`/`limiteLL`
 * de los puntos: no los lee, no los escribe y no dispara alertas. Sirve para
 * pintar el tramo en la vista de linepack y dibujar las líneas en su gráfico.
 * Una fila por cliente, tramo (`codigo` del `TramoLinepack`) y extremo.
 *
 * Diseño: gas-insideht-doc
 * `docs/superpowers/specs/2026-11-13-umbrales-tramo-linepack-design.md`.
 *
 * Un umbral `null` es "sin ese umbral", nunca cero.
 */

import { z } from "zod";

export const ExtremoLinepackSchema = z.enum(["P_INICIO", "P_FIN"]);
export type ExtremoLinepack = z.infer<typeof ExtremoLinepackSchema>;

const umbral = z.number().nonnegative().nullable();

const valores = {
  /** Presión mínima operativa, en `unidad`. */
  lo: umbral,
  /** Presión mínima crítica, en `unidad`. */
  lolo: umbral,
  /** Presión máxima operativa, en `unidad`. */
  hi: umbral,
  /** Presión máxima crítica, en `unidad` (referencia del proveedor: la MAPO del caño). */
  hihi: umbral,
  /** La `unidad` de la señal del extremo al cargar (`bar` o `kg/cm2`). */
  unidad: z.string().min(1),
};

type Valores = {
  lo: number | null;
  lolo: number | null;
  hi: number | null;
  hihi: number | null;
};

/**
 * `lolo ≤ lo < hi ≤ hihi` sobre los presentes, comparando **cada par**, no sólo
 * los vecinos: con `lo: 20, hihi: 15` y el resto `null`, falla.
 */
export function umbralesEnOrden(u: Valores): boolean {
  const cadena = [u.lolo, u.lo, u.hi, u.hihi];
  for (let i = 0; i < cadena.length; i++) {
    for (let j = i + 1; j < cadena.length; j++) {
      const a = cadena[i];
      const b = cadena[j];
      if (a === null || b === null) continue;
      // Entre un mínimo (lolo, lo) y un máximo (hi, hihi) el orden es estricto.
      const estricto = i < 2 && j >= 2;
      if (estricto ? !(a < b) : !(a <= b)) return false;
    }
  }
  return true;
}

/** Lo que se carga para un extremo: el body del `PUT`. */
export const ValoresUmbralLinepackSchema = z
  .object(valores)
  .refine(umbralesEnOrden, {
    message: "Umbrales fuera de orden: LOLO ≤ LO < HI ≤ HIHI",
  });
export type IValoresUmbralLinepack = z.infer<
  typeof ValoresUmbralLinepackSchema
>;

/** Sin refine: zod 4 no deja hacer `.omit` sobre un schema refinado. */
export const UmbralLinepackSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string(),
  /** `088-001-A`: el `codigo` del `TramoLinepack`, que es la clave del re-import. */
  codigoTramo: z.string(),
  extremo: ExtremoLinepackSchema,
  ...valores,
  /** Quién cargó el último cambio. */
  idUsuario: z.string().optional(),
  fechaActualizacion: z.string().optional(),
});
export type IUmbralLinepack = z.infer<typeof UmbralLinepackSchema>;

export const CreateUmbralLinepackSchema = UmbralLinepackSchema.omit({
  _id: true,
});
export type ICreateUmbralLinepack = z.infer<typeof CreateUmbralLinepackSchema>;

export const UpdateUmbralLinepackSchema = UmbralLinepackSchema.omit({
  _id: true,
  idCliente: true,
}).partial();
export type IUpdateUmbralLinepack = z.infer<typeof UpdateUmbralLinepackSchema>;

export type EstadoUmbral = "green" | "yellow" | "red" | "gray";

const BAR_POR_KGCM2 = 0.980665;
const A_BAR: Record<string, number> = { bar: 1, "kg/cm2": BAR_POR_KGCM2 };

/** Convierte entre `bar` y `kg/cm2`; `null` si alguna unidad no se conoce. */
export function convertirPresion(
  valor: number,
  desde: string,
  hacia: string,
): number | null {
  if (desde === hacia) return valor;
  const a = A_BAR[desde];
  const b = A_BAR[hacia];
  if (a === undefined || b === undefined) return null;
  return Number(((valor * a) / b).toPrecision(12));
}

/**
 * Estado de un extremo contra sus umbrales. Gris si no hay valor, si el valor no
 * es fresco (`calidad` distinta de `good`: un dato de hace días no puede pintar
 * verde) o si la unidad de la fila no se puede llevar a la de la señal.
 */
export function evaluarExtremo(
  valor: number | null | undefined,
  calidad: string | undefined,
  unidadSenal: string | undefined,
  u: IValoresUmbralLinepack,
): EstadoUmbral {
  if (typeof valor !== "number" || calidad !== "good") return "gray";
  const hacia = unidadSenal || "bar";
  const conv = (x: number | null) =>
    x === null ? null : convertirPresion(x, u.unidad, hacia);
  const lolo = conv(u.lolo);
  const lo = conv(u.lo);
  const hi = conv(u.hi);
  const hihi = conv(u.hihi);
  const perdido = [u.lolo, u.lo, u.hi, u.hihi].some(
    (x, i) => x !== null && [lolo, lo, hi, hihi][i] === null,
  );
  if (perdido) return "gray";
  if ((lolo !== null && valor < lolo) || (hihi !== null && valor > hihi))
    return "red";
  if ((lo !== null && valor < lo) || (hi !== null && valor > hi))
    return "yellow";
  return "green";
}

const GRAVEDAD: EstadoUmbral[] = ["gray", "green", "yellow", "red"];

/** El peor: red › yellow › green › gray. Vacío → gray. */
export const peorEstadoUmbral = (estados: EstadoUmbral[]): EstadoUmbral =>
  estados.reduce<EstadoUmbral>(
    (a, e) => (GRAVEDAD.indexOf(e) > GRAVEDAD.indexOf(a) ? e : a),
    "gray",
  );
