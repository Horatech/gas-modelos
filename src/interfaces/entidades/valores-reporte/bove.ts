import { IEstadosBove, UnidadConsumoBove } from "../configs-dispositivo";

/**
 * Reporte de totalizador acumulado (uplink básico)
 * Control Code variable, DI0/DI1 indican tipo
 */
export interface IReporteTotalizadorBove {
  consumo?: number; // BCD, valor acumulado
  bateryCapacity?: number; //
  unidadConsumo?: UnidadConsumoBove;
  estados?: IEstadosBove; // ST1 y ST2

  timestamp?: string; // Timestamp del reporte recibido
  intensidadSenal?: number; // RSSI o SNR si disponible
  tipoReporte?: "totalizador";
  motivoEvento?: string; // Si es respuesta a comando o evento
  deviceMeterNumber?: string; // Número de serie como identificador

  // Campos adicionales para modelos con presión/temperatura
  // se registran si están disponibles (según capabilities)
  presion?: number; // En bar o psi, según modelo
  temperatura?: number; // °C
}

/**
 * Reporte con logs horarios (12 logs de consumo por hora)
 * Representa consumo incremental por hora, no acumulado
 */
export interface IReporteLogsHorariosBove {
  horaInicio?: string; // Fecha/hora del primer log
  intervaloHoras?: number; // Fijo en 1 hora
  unidadConsumo?: UnidadConsumoBove;
  logsHorarios?: number[]; // Array de 12 elementos (consumo por hora)

  tipoReporte?: "horarios";
  motivoEvento?: string; // Generalmente automático
  timestamp?: string; // Timestamp de recepción
  deviceMeterNumber?: string; // Número de serie

  // Campos calculados
  consumoTotal?: number; // Suma de logs
  consumoPromedioPorHora?: number; // Promedio
}
