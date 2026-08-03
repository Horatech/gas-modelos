/**
 * Configuración específica para medidor ultrasónico de agua EUW300
 * Basado en el protocolo de comunicación v1.0 (2025-10-20)
 * Fabricante: Qingdao Comcore Technologies Co., Ltd.
 */

import { z } from "zod";
import type {
  IReporteDiarioEUW300,
  IReporteHorarioEUW300,
} from "../valores-reporte/euw300";

export const UnidadFlujoAcumuladoSchema = z.enum([
  "L",
  "L×10",
  "L×100",
  "m³",
  "m³×10",
  "m³×100",
]);
export type UnidadFlujoAcumulado = z.infer<typeof UnidadFlujoAcumuladoSchema>;

export const UnidadFlujoInstantaneoSchema = z.enum([
  "L/h",
  "L/h×10",
  "L/h×100",
  "m³/h",
  "m³/h×10",
  "m³/h×100",
]);
export type UnidadFlujoInstantaneo = z.infer<
  typeof UnidadFlujoInstantaneoSchema
>;

export const EstadoValvulaSchema = z.enum([
  "abierta",
  "cerrada",
  "semi-cerrada",
]);
export type EstadoValvula = z.infer<typeof EstadoValvulaSchema>;

/**
 * Estados detallados del medidor EUW300 (16 bits de estado)
 */
export const EstadosEUW300Schema = z.object({
  valvula: z.boolean().optional(), // D0: true = cerrada, false = abierta
  estadoValvula: z.boolean().optional(), // D1: true = anormal, false = normal
  bateria: z.boolean().optional(), // D2: true = bajo voltaje, false = normal
  almacenamiento: z.boolean().optional(), // D3: true = anormal, false = normal
  sistema: z.boolean().optional(), // D4: true = verificación, false = usuario
  medicion: z.boolean().optional(), // D5: true = falla, false = normal
  goteo: z.boolean().optional(), // D6: true = goteando, false = normal
  sobreflujo: z.boolean().optional(), // D7: true = anormal, false = normal
  tuboVacio: z.boolean().optional(), // D8: true = vacío, false = normal
  burbujas: z.boolean().optional(), // D9: true = burbuja, false = normal
  cuentaAbierta: z.boolean().optional(), // D10: true = abierta, false = no
  morosidad: z.boolean().optional(), // D11: true = deuda, false = normal
  flujoInverso: z.boolean().optional(), // D12: true = inverso, false = normal
  saldoBajo: z.boolean().optional(), // D13: true = bajo, false = normal
  estadoGP30: z.boolean().optional(), // D14: true = anormal, false = normal
  valvulaSemiCerrada: z.boolean().optional(), // D15: true = semi-cerrada, false = abierta
});
export type IEstadosEUW300 = z.infer<typeof EstadosEUW300Schema>;

/**
 * Configuración del dispositivo EUW300
 *
 * `ultimoReporteDiario`/`ultimoReporteHorario` usan z.custom (import type-only
 * de "../valores-reporte/euw300") para romper el ciclo euw300.ts <->
 * dispositivoEUW300.ts: euw300.ts necesita los schemas reales de este archivo
 * (EstadosEUW300Schema/UnidadFlujo*Schema) en runtime, así que este archivo no
 * puede importar en runtime de vuelta a euw300.ts.
 */
export const DispositivoEUW300Schema = z.object({
  // Configuración básica
  meterType: z.number().optional(), // Siempre 10H para water meter
  deviceMeterNumber: z.string().optional(), // 7 bytes BCD (14 dígitos)

  // Configuración de comunicación
  modoTransmision: z.enum(["texto-plano", "cifrado"]).optional(), // D3 del control code
  intervaloComunicacion: z.number().optional(), // Minutos entre reportes
  horaReporteDiario: z.string().optional(), // Hora del reporte diario (formato HH:mm)

  // Configuración de unidades por defecto
  unidadFlujoAcumuladoDefault: UnidadFlujoAcumuladoSchema.optional(),
  unidadFlujoInstantaneoDefault: UnidadFlujoInstantaneoSchema.optional(),

  // Datos del último reporte diario
  ultimoReporteDiario: z.custom<IReporteDiarioEUW300>().optional(),

  // Datos del último reporte horario
  ultimoReporteHorario: z.custom<IReporteHorarioEUW300>().optional(),

  // Estado actual simplificado
  estadoValvula: EstadoValvulaSchema.optional(),
  estadoGeneral: z.enum(["normal", "alerta", "error"]).optional(),

  // Configuración de alertas
  alertaBateriaActivada: z.boolean().optional(),
  alertaGoteoActivada: z.boolean().optional(),
  alertaSobreflujoActivada: z.boolean().optional(),
  alertaTuboVacioActivada: z.boolean().optional(),
  alertaBurbujasActivada: z.boolean().optional(),
  alertaFlujoInversoActivada: z.boolean().optional(),

  // Límites de alerta
  limiteCaudalMaximo: z.number().optional(),
  limiteCaudalMinimo: z.number().optional(),
  limiteTemperaturaMaxima: z.number().optional(),
  limiteTemperaturaMinima: z.number().optional(),
});
export type IDispositivoEUW300 = z.infer<typeof DispositivoEUW300Schema>;
