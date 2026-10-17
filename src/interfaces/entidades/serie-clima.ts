import { z } from "zod";
import { DesfaseMinSchema, MAX_PUNTOS_SERIE_SCADA, SerieScadaSchema } from "./historian";
import { esCanalClima } from "./perfil-lectura";

/**
 * Series de clima para el gráfico personalizado: temperatura, sensación térmica, viento y presión atmosférica de
 * una Localidad o de un Centro Operativo (promedio de sus Localidades con clima, hora por hora). La respuesta tiene
 * la forma de la serie SCADA.
 */

export const MAX_ITEMS_SERIES_CLIMA = 20;

/** Dónde se pide el clima. La Unidad de Negocio no: abarca regiones con climas distintos. */
export const NivelClimaSchema = z.enum(["Localidad", "CentroOperativo"]);
export type NivelClima = z.infer<typeof NivelClimaSchema>;

export const AmbitoClimaSchema = z.object({
  nivel: NivelClimaSchema,
  id: z.string().min(1),
});
export type IAmbitoClima = z.infer<typeof AmbitoClimaSchema>;

export const ItemSerieClimaSchema = z.object({
  canal: z.string().refine(esCanalClima, { message: "canal de clima inválido" }),
  ambito: AmbitoClimaSchema,
});
export type IItemSerieClima = z.infer<typeof ItemSerieClimaSchema>;

/** `POST /clima/series`. */
export const PedidoSeriesClimaSchema = z.object({
  items: z.array(ItemSerieClimaSchema).min(1).max(MAX_ITEMS_SERIES_CLIMA),
  desde: z.string(),
  hasta: z.string(),
  maxPuntos: z.coerce.number().int().positive().max(MAX_PUNTOS_SERIE_SCADA).optional(),
  /** Minutos desde las 00:00 UTC al inicio del día (`desfaseCorteDiario`). Sin él, día gas. */
  desfaseMin: DesfaseMinSchema.optional(),
});
export type IPedidoSeriesClima = z.infer<typeof PedidoSeriesClimaSchema>;

export const SeriesClimaSchema = z.object({
  /** En el orden de `items`. */
  series: z.array(z.object({ canal: z.string(), ambito: AmbitoClimaSchema, serie: SerieScadaSchema })),
});
export type ISeriesClima = z.infer<typeof SeriesClimaSchema>;
