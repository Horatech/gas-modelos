import { z } from "zod";
import { MAX_PUNTOS_SERIE_SCADA, SerieScadaSchema } from "./historian";
import { CANAL_LINEPACK, esCanalLinepack } from "./perfil-lectura";

/**
 * Series de la red de linepack de Aquiom para el gráfico personalizado (`PERFIL_LINEPACK`): una señal de un tramo
 * (linepack, presión promedio, de inicio o de fin), o el linepack de un subsistema o de un sistema (la suma de sus
 * tramos). Una por hora, reconstruida con nuestras series SCADA. La respuesta tiene la forma de la serie SCADA.
 */

export const MAX_ITEMS_SERIES_LINEPACK = 20;

/** Dónde se pide: los ids son los de Aquiom (`sistema.id`, `subsistema.id`, `tramo.asset_id`). */
export const NivelLinepackSchema = z.enum(["Sistema", "Subsistema", "Tramo"]);
export type NivelLinepack = z.infer<typeof NivelLinepackSchema>;

export const AmbitoLinepackSchema = z.object({
  nivel: NivelLinepackSchema,
  id: z.string().min(1),
});
export type IAmbitoLinepack = z.infer<typeof AmbitoLinepackSchema>;

/** Un subsistema o un sistema sólo tiene linepack: las presiones son de cada tramo. */
export function canalValidoEn(canal: string, a: IAmbitoLinepack): boolean {
  return esCanalLinepack(canal) && (a.nivel === "Tramo" || canal === CANAL_LINEPACK);
}

export const ItemSerieLinepackSchema = z
  .object({
    canal: z.string(),
    linepack: AmbitoLinepackSchema,
  })
  .refine((i) => canalValidoEn(i.canal, i.linepack), { message: "canal de linepack inválido" });
export type IItemSerieLinepack = z.infer<typeof ItemSerieLinepackSchema>;

/** `POST /linepack/series`. Sin corte diario: la serie es horaria. */
export const PedidoSeriesLinepackSchema = z.object({
  items: z.array(ItemSerieLinepackSchema).min(1).max(MAX_ITEMS_SERIES_LINEPACK),
  desde: z.string(),
  hasta: z.string(),
  maxPuntos: z.coerce.number().int().positive().max(MAX_PUNTOS_SERIE_SCADA).optional(),
});
export type IPedidoSeriesLinepack = z.infer<typeof PedidoSeriesLinepackSchema>;

export const SeriesLinepackSchema = z.object({
  /** En el orden de `items`. */
  series: z.array(
    z.object({
      canal: z.string(),
      linepack: AmbitoLinepackSchema,
      serie: SerieScadaSchema,
      /** Lo que no se pudo reconstruir, para el usuario ("suma 41 de 43 tramos"). */
      avisos: z.array(z.string()).optional(),
    }),
  ),
});
export type ISeriesLinepack = z.infer<typeof SeriesLinepackSchema>;
