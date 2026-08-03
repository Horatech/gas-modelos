/**
 * Configuración específica para medidor ultrasónico LoRaWAN Bove
 * Basado en el protocolo propietario Bove para medidores de agua ultrasónicos.
 * Fabricante: Bove (modelos como BECO, B91, B97, B39, DN ≥ 50).
 */

import { z } from "zod";
import type {
  IReporteTotalizadorBove,
  IReporteLogsHorariosBove,
} from "../valores-reporte/bove";

export const UnidadConsumoBoveSchema = z.enum([
  "0.001 m³",
  "0.01 m³",
  "0.1 m³",
  "1 m³",
  "0.0001 m³",
]);
export type UnidadConsumoBove = z.infer<typeof UnidadConsumoBoveSchema>;

export const ModoTemporalidadSchema = z.enum(["INTERVAL", "TIMEPOINT", "OFF"]);
export type ModoTemporalidad = z.infer<typeof ModoTemporalidadSchema>;

/**
 * Perfil de capacidades del medidor Bove
 * Define las características físicas y funcionales del dispositivo
 * para interpretar correctamente los bits de estado y reportes.
 */
export const BoveCapabilitiesSchema = z.object({
  hasValve: z.boolean().optional(), // Si el medidor tiene válvula integrada
  hasPressureSensor: z.boolean().optional(), // Si mide presión
  hasTemperatureSensor: z.boolean().optional(), // Si mide temperatura
  isDn50OrGreater: z.boolean().optional(), // Si DN ≥ 50 (afecta bits de estado)
});
export type IBoveCapabilities = z.infer<typeof BoveCapabilitiesSchema>;

/**
 * Estados detallados del medidor Bove (ST1 y ST2, 2 bytes)
 * Los bits se interpretan según el perfil de capacidades del dispositivo.
 */
export const EstadosBoveSchema = z.object({
  lowBatteryAlarm: z.boolean().optional(),
  emptyPipeAlarm: z.boolean().optional(),
  reverseFlowAlarm: z.boolean().optional(),
  overRangeAlarm: z.boolean().optional(),
  overTempratureAlarm: z.boolean().optional(),
  eEPROMError: z.boolean().optional(),
  leakagealarm: z.boolean().optional(),
  burstAlarm: z.boolean().optional(),
  valveStatus: z.enum(["Open", "Close", "Abnormal"]).optional(),
  batteryAlarm: z.boolean().optional(),
});
export type IEstadosBove = z.infer<typeof EstadosBoveSchema>;

/**
 * Configuración del dispositivo Bove
 *
 * `ultimoReporteTotalizador`/`ultimoReporteLogsHorarios` usan z.custom (import
 * type-only de "../valores-reporte/bove") para romper el ciclo bove.ts <->
 * dispositivoBove.ts: bove.ts necesita los schemas reales de este archivo
 * (EstadosBoveSchema/UnidadConsumoBoveSchema) en runtime, así que este archivo
 * no puede importar en runtime de vuelta a bove.ts.
 */
export const DispositivoBoveSchema = z.object({
  // Configuración básica
  numeroSerie: z.string().optional(), // Número de serie del medidor

  // Perfil de capacidades (clave para interpretar bits)
  capabilities: BoveCapabilitiesSchema.optional(),

  modoConfirmacion: z.enum(["confirmed", "unconfirmed"]).optional(), // AT+ULCONFIRMED
  timeSyncInterval: z.number().optional(), // Días entre sincronización horaria (default 7)

  // Configuración de temporalidad (guardar como fuente de verdad)
  modoTemporalidad: ModoTemporalidadSchema.optional(),
  intervaloMinutos: z.number().optional(), // Para INTERVAL
  horarioFijo: z.string().optional(), // Para TIMEPOINT, formato "HH:MM"

  // Configuración de unidades por defecto
  unidadConsumoDefault: UnidadConsumoBoveSchema.optional(),

  // Datos del último reporte totalizador
  ultimoReporteTotalizador: z.custom<IReporteTotalizadorBove>().optional(),

  // Datos del último reporte de logs horarios
  ultimoReporteLogsHorarios: z.custom<IReporteLogsHorariosBove>().optional(),
});
export type IDispositivoBove = z.infer<typeof DispositivoBoveSchema>;
