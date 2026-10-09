import { z } from "zod";

/**
 * Fuente SCADA de un cliente: un servidor del que un adaptador on-premise lee tags (p. ej. en
 * Camuzzi, el nodo iFIX `FIX` en srv-ifix01 y `FIX02` en srv-ifix02). Cada fuente la lee una
 * instancia propia del adaptador. El endpoint y las credenciales viven en el env de esa instancia,
 * no acá.
 *
 * Un tag de la fuente por defecto se guarda sin prefijo (`TAG`), como siempre. El de cualquier otra
 * fuente se guarda calificado con su alias (`FIX02.TAG`), que es como lo nombra el propio iFIX
 * (`NODO.TAG.CAMPO`). Así un tag pertenece a una sola fuente y sigue siendo único por sí mismo.
 *
 * Plan: `gas/PLAN-MULTI-FUENTE-SCADA.md`.
 *
 * Archivo hoja: no lo importa ningún otro schema.
 */

/** Separa el alias de la fuente del tag base. */
export const SEPARADOR_FUENTE_SCADA = ".";

/**
 * Campos de iFIX que se aceptan al final del tag ingresado y se descartan: el adaptador decide qué
 * nodos lee de cada tag. `F_CV` es el valor actual (lo usan los mimics y el Historian).
 */
export const CAMPOS_IFIX_DESCARTABLES = ["F_CV"] as const;

export const ProtocoloFuenteScadaSchema = z.enum(["opcua"]);
export type ProtocoloFuenteScada = z.infer<typeof ProtocoloFuenteScadaSchema>;

/** Cómo arma el adaptador los nodos a partir del tag base. `ifix`: `ns=2;s=13$<TAG>.CV` y `ns=2;s=11$<TAG>.E_*`. */
export const PerfilNodeIdScadaSchema = z.enum(["ifix"]);
export type PerfilNodeIdScada = z.infer<typeof PerfilNodeIdScadaSchema>;

export const FuenteScadaSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  idCliente: z.string(),
  /** Prefijo de los tags de esta fuente: el nombre del nodo SCADA (`FIX`, `FIX02`). Sin `.` ni espacios. */
  alias: z.string().regex(/^[^.\s]+$/),
  /** La de los tags sin prefijo. Una por cliente. */
  porDefecto: z.boolean(),
  /** `CANAL_INST` del adaptador que la lee: los comandos de sus tags van a esa instancia. */
  inst: z.string(),
  protocolo: ProtocoloFuenteScadaSchema,
  perfilNodeId: PerfilNodeIdScadaSchema,
  /** Para mostrar en el portal */
  nombre: z.string().optional(),
});
export type IFuenteScada = z.infer<typeof FuenteScadaSchema>;

export const CreateFuenteScadaSchema = FuenteScadaSchema.omit({ _id: true });
export type ICreateFuenteScada = z.infer<typeof CreateFuenteScadaSchema>;
export const UpdateFuenteScadaSchema = CreateFuenteScadaSchema.partial();
export type IUpdateFuenteScada = z.infer<typeof UpdateFuenteScadaSchema>;

/** Lo mínimo de una fuente que hace falta para normalizar un tag. */
export type FuenteParaTagScada = Pick<IFuenteScada, "alias" | "porDefecto">;

/**
 * Un tag tal como está guardado, separado en fuente y tag base. Sin prefijo, la fuente es la por
 * defecto (`fuente` ausente).
 */
export function partirTagScada(tagGuardado: string): { fuente?: string; tag: string } {
  const i = tagGuardado.indexOf(SEPARADOR_FUENTE_SCADA);
  if (i < 0) return { tag: tagGuardado };
  return { fuente: tagGuardado.slice(0, i), tag: tagGuardado.slice(i + 1) };
}

/**
 * Si un tag guardado lo lee el adaptador de `fuente`. `fuente` ausente = la fuente por defecto, que
 * lee los tags sin prefijo.
 */
export function esTagDeFuenteScada(tagGuardado: string, fuente?: string): boolean {
  return partirTagScada(tagGuardado).fuente === (fuente || undefined);
}

/** Tag guardado a partir de la fuente y el tag base. */
export function calificarTagScada(tag: string, fuente?: string): string {
  return fuente ? `${fuente}${SEPARADOR_FUENTE_SCADA}${tag}` : tag;
}

export type ResultadoNormalizarTagScada =
  | { ok: true; tag: string; fuente?: string }
  | { ok: false; error: "VACIO" | "FORMATO" | "FUENTE_DESCONOCIDA"; detalle: string };

/**
 * Lleva un tag como se ingresa (como lo muestra iFIX o como lo guardamos) a como se guarda:
 * - `TAG`, `TAG.F_CV` → `TAG`
 * - `<alias por defecto>.TAG[.F_CV]` → `TAG`
 * - `<otro alias>.TAG[.F_CV]` → `<otro alias>.TAG`, si el alias es una fuente del cliente
 *
 * Sólo corta por `.`: el tag base puede tener `-`, `&` o `Ñ`.
 */
export function normalizarTagScada(
  entrada: string,
  fuentes: readonly FuenteParaTagScada[],
): ResultadoNormalizarTagScada {
  const texto = (entrada ?? "").trim();
  if (!texto) return { ok: false, error: "VACIO", detalle: "El tag está vacío" };
  const partes = texto.split(SEPARADOR_FUENTE_SCADA);
  if ((CAMPOS_IFIX_DESCARTABLES as readonly string[]).includes(partes[partes.length - 1]))
    partes.pop();
  if (partes.length === 0 || partes.length > 2 || partes.some((p) => !p.trim() || p !== p.trim()))
    return {
      ok: false,
      error: "FORMATO",
      detalle: `"${texto}" no tiene la forma TAG o FUENTE.TAG`,
    };
  if (partes.length === 1) return { ok: true, tag: partes[0] };
  const [alias, tag] = partes;
  const fuente = fuentes.find((f) => f.alias === alias);
  if (!fuente)
    return {
      ok: false,
      error: "FUENTE_DESCONOCIDA",
      detalle: `"${alias}" no es una fuente SCADA del cliente`,
    };
  return fuente.porDefecto ? { ok: true, tag } : { ok: true, tag: calificarTagScada(tag, alias), fuente: alias };
}
