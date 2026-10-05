/**
 * Valores de reporte de una estación de bombeo (vertical saneamiento).
 *
 * Origen: RTU de campo (hoy Milesight UC300 4G, gas-api-rtu). Un documento por
 * reporte periódico F4 del equipo, en forma ancha: todas las señales de la
 * estación en `canales`, con la clave que define la plantilla
 * ('pozo.nivel_m', 'b2.marcha', 'b1.variador_sano', …).
 *
 * `ok` = el valor es una lectura fresca de ese ciclo. En el UC300 sale del bit 3
 * de cada canal Modbus: en 0, el equipo repite el último valor cacheado sin marca
 * de antigüedad. Un valor con `ok: false` no se usa como dato actual.
 */

import { z } from "zod";

export const ValorCanalBombeoSchema = z.object({
  valor: z.union([z.number(), z.boolean()]),
  ok: z.boolean(),
});
export type IValorCanalBombeo = z.infer<typeof ValorCanalBombeoSchema>;

export const ReporteBombeoSchema = z.object({
  /** ISO. Reloj del equipo = instante de la medición. */
  timestamp: z.string(),
  /** ISO. Cuándo lo recibió la plataforma. */
  recibidoEn: z.string().optional(),
  /** Plantilla con la que se tradujo el reporte ('uc300-3b', 'uc300-2b'). */
  plantilla: z.string(),
  /** Señal celular en asu (dBm = −113 + 2·asu). */
  senalAsu: z.number().optional(),
  /** Salidas digitales del RTU: true = relé excitado. */
  salidas: z.record(z.string(), z.boolean()).optional(),
  /** Entradas digitales crudas del RTU ('DI1'…'DI4'). */
  entradas: z.record(z.string(), z.boolean()).optional(),
  canales: z.record(z.string(), ValorCanalBombeoSchema),
  /** Diferencias entre lo que trajo el equipo y la plantilla (config de RTU distinta). */
  discrepancias: z.array(z.string()).optional(),
});
export type IReporteBombeo = z.infer<typeof ReporteBombeoSchema>;
