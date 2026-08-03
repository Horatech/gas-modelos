import { z } from "zod";
import {
  EstadosBoveSchema,
  UnidadConsumoBoveSchema,
} from "../configs-dispositivo/dispositivoBove";

/**
 * Reporte de totalizador acumulado (uplink básico)
 * Control Code variable, DI0/DI1 indican tipo
 */
export const ReporteTotalizadorBoveSchema = z.object({
  consumo: z.number().optional(), // BCD, valor acumulado
  bateryCapacity: z.number().optional(), //
  unidadConsumo: UnidadConsumoBoveSchema.optional(),
  estados: EstadosBoveSchema.optional(), // ST1 y ST2

  timestamp: z.string().optional(), // Timestamp del reporte recibido
  intensidadSenal: z.number().optional(), // RSSI o SNR si disponible
  tipoReporte: z.literal("totalizador").optional(),
  motivoEvento: z.string().optional(), // Si es respuesta a comando o evento
  deviceMeterNumber: z.string().optional(), // Número de serie como identificador

  // Campos adicionales para modelos con presión/temperatura
  // se registran si están disponibles (según capabilities)
  presion: z.number().optional(), // En bar o psi, según modelo
  temperatura: z.number().optional(), // °C
});
export type IReporteTotalizadorBove = z.infer<
  typeof ReporteTotalizadorBoveSchema
>;

/**
 * Reporte con logs horarios (12 logs de consumo por hora)
 * Representa consumo incremental por hora, no acumulado
 */
export const ReporteLogsHorariosBoveSchema = z.object({
  horaInicio: z.string().optional(), // Fecha/hora del primer log
  intervaloHoras: z.number().optional(), // Fijo en 1 hora
  unidadConsumo: UnidadConsumoBoveSchema.optional(),
  logsHorarios: z.array(z.number()).optional(), // Array de 12 elementos (consumo por hora)

  tipoReporte: z.literal("horarios").optional(),
  motivoEvento: z.string().optional(), // Generalmente automático
  timestamp: z.string().optional(), // Timestamp de recepción
  deviceMeterNumber: z.string().optional(), // Número de serie

  // Campos calculados
  consumoTotal: z.number().optional(), // Suma de logs
  consumoPromedioPorHora: z.number().optional(), // Promedio
});
export type IReporteLogsHorariosBove = z.infer<
  typeof ReporteLogsHorariosBoveSchema
>;
