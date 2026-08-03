import { z } from "zod";
import {
  EstadosEUW300Schema,
  UnidadFlujoAcumuladoSchema,
  UnidadFlujoInstantaneoSchema,
} from "../configs-dispositivo/dispositivoEUW300";

/**
 * Datos de reporte diario congelado (0x7028)
 */
export const ReporteDiarioEUW300Schema = z.object({
  flujoAcumuladoActual: z.number().optional(), // BCD, 4 bytes
  unidadFlujoAcumulado: UnidadFlujoAcumuladoSchema.optional(),
  caudalMinimoDia: z.number().optional(), // BCD, 4 bytes con 4 decimales
  unidadCaudalMinimo: UnidadFlujoInstantaneoSchema.optional(),
  caudalMaximoDia: z.number().optional(), // BCD, 4 bytes con 4 decimales
  unidadCaudalMaximo: UnidadFlujoInstantaneoSchema.optional(),
  temperaturaAgua: z.number().optional(), // °C con 2 decimales
  temperaturaAmbiente: z.number().optional(), // °C entero con signo (-128 a +127)
  contadorRevoluciones: z.number().optional(), // 1 byte HEX (Cumulative revolution count)
  tiempoTotalTrabajo: z.number().optional(), // horas, BCD 3 bytes
  fechaHora: z.string().optional(), // ISO string de la fecha/hora real
  estados: EstadosEUW300Schema.optional(), // 2 bytes HEX convertidos a objeto
  intensidadSenal: z.number().optional(), // 1 byte HEX

  tipoReporte: z.enum(["diario", "evento"]).optional(), // Diferencia entre 0x7028 y 0x7029
  motivoEvento: z.string().optional(), // Si es evento o alarma, motivo del mismo
  timestamp: z.string().optional(), // Timestamp de recepción (fechaCreacion del reporte)
  deviceMeterNumber: z.string().optional(), // Dirección del dispositivo (14 dígitos BCD)
  modoTransmision: z.enum(["texto-plano", "cifrado"]).optional(), // Modo de transmisión

  consumo: z.number().optional(), // Alias de flujoAcumuladoActual (ACUMULADO/odómetro, no parcial)
  consumoParcial: z.number().optional(), // Consumo del período = consumo(este) - consumo(reporte anterior)
  nivelBateria: z.number().optional(), // Porcentaje estimado de batería
  serialNumber: z.string().optional(), // Número de serie del medidor
});
export type IReporteDiarioEUW300 = z.infer<typeof ReporteDiarioEUW300Schema>;

/**
 * Datos de reporte horario congelado (0x8409)
 * Contiene datos acumulados de 12 horas
 */
export const ReporteHorarioEUW300Schema = z.object({
  horaInicio: z.string().optional(), // Formato: MMDDhhmm convertido a string
  intervaloHoras: z.number().optional(), // Fijo en 1 hora
  unidadFlujoAcumulado: UnidadFlujoAcumuladoSchema.optional(),
  flujoAcumuladoInicial: z.number().optional(), // Lectura acumulada al inicio del período, ya escalada según unidadFlujoAcumulado
  incrementosHorarios: z.array(z.number()).optional(), // 11 incrementos por hora (parciales), ya escalados según unidadFlujoAcumulado

  tipoReporte: z.enum(["horario", "evento"]).optional(), // Puede ser disparado por evento
  motivoEvento: z.string().optional(), // Si fue disparado por alarma/evento
  timestamp: z.string().optional(), // ✅ Se genera al recibir
  deviceMeterNumber: z.string().optional(), // ✅ Viene en header de trama
  modoTransmision: z.enum(["texto-plano", "cifrado"]).optional(), // ✅ Control code

  // Campos calculados útiles (en la unidad base de unidadFlujoAcumulado)
  consumoTotal: z.number().optional(), // Suma total de incrementos = consumo del período
  consumoPromedioPorHora: z.number().optional(), // Promedio por hora
});
export type IReporteHorarioEUW300 = z.infer<typeof ReporteHorarioEUW300Schema>;
