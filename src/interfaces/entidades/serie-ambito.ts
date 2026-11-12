import { z } from "zod";
import { SerieScadaSchema } from "./historian";
import { esCanalAmbito } from "./perfil-lectura";

/**
 * Series del resumen diario por ámbito para el gráfico personalizado y el asistente: el consumo residencial de una
 * Localidad, de un Centro Operativo o de una Unidad de Negocio (la suma de sus Localidades), un valor por día gas.
 * La respuesta tiene la forma de la serie SCADA: `[inicio del día gas, valor]`.
 */

export const MAX_ITEMS_SERIES_AMBITO = 20;

/** Dónde se pide. A diferencia del clima, la Unidad de Negocio sí: un consumo se suma entre regiones. */
export const NivelAmbitoSerieSchema = z.enum(["Localidad", "CentroOperativo", "UnidadNegocio"]);
export type NivelAmbitoSerie = z.infer<typeof NivelAmbitoSerieSchema>;

export const AmbitoSerieSchema = z.object({
  nivel: NivelAmbitoSerieSchema,
  id: z.string().min(1),
});
export type IAmbitoSerie = z.infer<typeof AmbitoSerieSchema>;

export const ItemSerieAmbitoSchema = z.object({
  canal: z.string().refine(esCanalAmbito, { message: "canal de ámbito inválido" }),
  ambito: AmbitoSerieSchema,
});
export type IItemSerieAmbito = z.infer<typeof ItemSerieAmbitoSchema>;

/** `POST /ambitos/series`. La resolución es siempre diaria (día gas). */
export const PedidoSeriesAmbitoSchema = z.object({
  items: z.array(ItemSerieAmbitoSchema).min(1).max(MAX_ITEMS_SERIES_AMBITO),
  desde: z.string(),
  hasta: z.string(),
});
export type IPedidoSeriesAmbito = z.infer<typeof PedidoSeriesAmbitoSchema>;

export const SeriesAmbitoSchema = z.object({
  /** En el orden de `items`. */
  series: z.array(z.object({ canal: z.string(), ambito: AmbitoSerieSchema, serie: SerieScadaSchema })),
});
export type ISeriesAmbito = z.infer<typeof SeriesAmbitoSchema>;
