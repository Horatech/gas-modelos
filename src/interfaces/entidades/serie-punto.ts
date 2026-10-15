import { z } from "zod";
import { DesfaseMinSchema, MAX_PUNTOS_SERIE_SCADA, RESOLUCION_HISTORIAN_MS, SerieScadaSchema } from "./historian";
import type { ResolucionHistorian } from "./historian";
import { parseCanalRef } from "./perfil-lectura";

/**
 * Series de puntos que no son SCADA para el gráfico personalizado (P56 § 6): presión de unidades de presión y
 * canales de correctoras. Todo local, sin Historian. La respuesta tiene la forma de la serie SCADA.
 * Plan: gas-insideht-doc docs/superpowers/plans/2026-10-15-graficos-todos-los-puntos.md
 */

export const MAX_ITEMS_SERIES_PUNTO = 20;

/**
 * Dónde corta el día en los baldes diarios. Nunca UTC: `dia-gas` va de 07:00 a 06:59 de Argentina; `dia-calendario`
 * va de 00:00 a 23:59 en la hora del navegador.
 */
export const CorteDiarioSchema = z.enum(["dia-gas", "dia-calendario"]);
export type CorteDiario = z.infer<typeof CorteDiarioSchema>;

/** El día gas arranca a las 10:00 UTC (07:00 de Argentina). Mismo valor que gas-cron (`llegada-tardia.ts`). */
export const HORAS_OFFSET_DIA_GAS = 10;

/**
 * Minutos desde las 00:00 UTC hasta el inicio del día del corte. Para `dia-calendario` hace falta el
 * `getTimezoneOffset()` del navegador (180 en Argentina): el backend no supone zona.
 */
export function desfaseCorteDiario(corte: CorteDiario, timezoneOffsetMin = 0): number {
  return corte === "dia-gas" ? HORAS_OFFSET_DIA_GAS * 60 : timezoneOffsetMin;
}

/**
 * Inicio del balde que contiene `t`, con los baldes corridos `desfaseMin` respecto de la época UTC. Con desfase 0
 * es el `inicioBalde` de la serie SCADA.
 */
export function inicioBaldeConDesfase(t: number, r: ResolucionHistorian, desfaseMin: number): number {
  const ms = RESOLUCION_HISTORIAN_MS[r];
  const d = desfaseMin * 60_000;
  return t - ((((t - d) % ms) + ms) % ms);
}

export const ItemSeriePuntoSchema = z.object({
  idPunto: z.string().min(1),
  canal: z.string().refine((c) => parseCanalRef(c) !== null, { message: "canal inválido" }),
});
export type IItemSeriePunto = z.infer<typeof ItemSeriePuntoSchema>;

/** `POST /puntos/series`. */
export const PedidoSeriesPuntoSchema = z.object({
  items: z.array(ItemSeriePuntoSchema).min(1).max(MAX_ITEMS_SERIES_PUNTO),
  desde: z.string(),
  hasta: z.string(),
  maxPuntos: z.coerce.number().int().positive().max(MAX_PUNTOS_SERIE_SCADA).optional(),
  /** Minutos desde las 00:00 UTC al inicio del día (`desfaseCorteDiario`). Sin él, día gas. */
  desfaseMin: DesfaseMinSchema.optional(),
});
export type IPedidoSeriesPunto = z.infer<typeof PedidoSeriesPuntoSchema>;

export const SeriesPuntoSchema = z.object({
  /** En el orden de `items`. */
  series: z.array(z.object({ idPunto: z.string(), canal: z.string(), serie: SerieScadaSchema })),
});
export type ISeriesPunto = z.infer<typeof SeriesPuntoSchema>;
