/**
 * Límites de presión de un nodo de la red de linepack: mínimo operativo (LO),
 * mínimo crítico (LOLO), máximo (HI) y máximo crítico (HIHI).
 *
 * El nodo es un punto de medición: el real de un extremo medido o, sólo para la
 * limitadora, su punto virtual. Un nodo compartido por varios tramos tiene un
 * solo límite, y lo ven todos los usuarios del cliente. El límite de los demás
 * nodos virtuales no se guarda: gas-api-cliente lo calcula con la fórmula del
 * nodo sobre los límites de los nodos medidos.
 *
 * Es un juego **paralelo** a los límites del iFIX y a los `limiteL`/`limiteLL`
 * de los puntos: no los lee, no los escribe y no dispara alertas. Con LO y LOLO
 * se calculan el linepack mínimo y el crítico de cada tramo; HI y HIHI se
 * comparan con la presión de cada extremo (no hay linepack máximo).
 *
 * Diseño: gas-insideht-doc
 * `docs/superpowers/specs/2026-11-19-linepack-limites-nodo-segmentos-design.md`.
 *
 * Un límite `null` es "sin ese límite", nunca cero.
 */

import { z } from "zod";

const limite = z.number().nonnegative().nullable();

const valores = {
  /** Presión mínima operativa, en `unidad`. */
  lo: limite,
  /** Presión mínima crítica, en `unidad`. */
  lolo: limite,
  /** Presión máxima operativa, en `unidad`. */
  hi: limite,
  /** Presión máxima crítica, en `unidad`. */
  hihi: limite,
  /** La `unidad` de la señal del nodo al cargar (`bar` o `kg/cm2`). */
  unidad: z.string().min(1),
};

/**
 * Opcionales en el tipo porque los consumidores compilan `modelos/src` sin
 * `strictNullChecks`: un ausente (`undefined`) vale `null`.
 */
type Valores = {
  lo?: number | null;
  lolo?: number | null;
  hi?: number | null;
  hihi?: number | null;
};

const ORDEN = ["lolo", "lo", "hi", "hihi"] as const;
const SUPERIORES = new Set<string>(["hi", "hihi"]);

/**
 * `lolo ≤ lo < hi ≤ hihi` entre los presentes: cada par que está, en ese orden.
 * Entre un límite inferior y uno superior, estricto.
 */
export function umbralesEnOrden(u: Valores): boolean {
  const presentes = ORDEN.flatMap((k) => {
    const v = u[k] ?? null;
    return v === null ? [] : [{ k, v }];
  });
  return presentes.every((a, i) =>
    presentes
      .slice(i + 1)
      .every((b) =>
        !SUPERIORES.has(a.k) && SUPERIORES.has(b.k) ? a.v < b.v : a.v <= b.v,
      ),
  );
}

/** Lo que se carga para un nodo: el body del `PUT`. */
export const ValoresUmbralLinepackSchema = z
  .object(valores)
  .refine(umbralesEnOrden, {
    message: "Límites fuera de orden: LOLO ≤ LO < HI ≤ HIHI",
  });
export type IValoresUmbralLinepack = z.infer<
  typeof ValoresUmbralLinepackSchema
>;

/** Sin refine: zod 4 no deja hacer `.omit` sobre un schema refinado. */
export const UmbralLinepackSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string(),
  /** El nodo: el punto de medición del extremo (real, o virtual en la limitadora). */
  idPuntoMedicion: z.string(),
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

/**
 * Color de un tramo o segmento: por abajo, su linepack actual contra el mínimo
 * (amarillo) y el crítico (rojo); por arriba, la presión de cada extremo contra
 * el máximo (amarillo) y el máximo crítico (rojo) de su nodo. Gana el peor.
 */
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
