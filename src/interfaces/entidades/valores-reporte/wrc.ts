/**
 * Interfaz para un registro individual de dense data (datos horarios)
 * Representa una medición en un período específico (ej: cada hora)
 */
export interface IDenseDataRecord {
  /** Timestamp del registro en formato ISO 8601 */
  timestamp: string;
  /** Diferencia de pulsos en este período (puede ser negativo) */
  pulsos: number;
  /** Consumo calculado en m³ para este período (usando pulse_constant) */
  consumo?: number;
}

/**
 * Interfaz para los datos densos parseados de un día completo
 * Contiene múltiples registros horarios extraídos del campo dense_data_one_day
 */
export interface IDenseDataParsed {
  /** Timestamp de inicio del período de medición (ISO 8601) */
  startTime: string;
  /** Número de pulsos acumulados al inicio del período */
  initialPulses: number;
  /** Ciclo de adquisición en minutos (15, 30, 60, etc.) */
  cycle: number;
  /** Array de registros horarios individuales */
  records: IDenseDataRecord[];
  /** Datos crudos originales (para debugging/auditoría) */
  raw?: { type?: string; data?: number[] };
}

export interface IReporteWRC {
  device_information?: DeviceInformation;
  fix_iot?: FixIot;
  meter_info?: MeterInfo;
  valve?: FixIot;
  alarm?: Alarm;
  // Parsed
  timestamp?: string;
  consumo?: number;
  consumoNegativo?: number;
  bateria?: number;
}

export interface Alarm {
  magnetic_attack_status?: number;
  historical_magnetic_attack?: number;
  anti_tamper_alarm?: number;
  historical_anti_tamper_alarm?: number;
  leakage_alarm?: number;
  over_flow_alarm?: number;
  meter_stop_alarm?: number;
  reverse_flow_alarm?: number;
}

export interface DeviceInformation {
  serial_number?: string;
  current_time?: number;
  time_zone?: string;
  module_name?: string;
  power_voltage?: number;
  device_type?: number;
  hardware_version?: string;
  software_version?: string;
  battery_status?: number;
  message_packet_sequence?: number;
}

export interface FixIot {}

export interface MeterInfo {
  measurement_mode?: number;
  typical_flow?: number;
  metering_error_status?: number;
  meter_reading?: number;
  positive_accumulated_flow?: number;
  reverse_accumulated_flow?: number;
  pulse_constant?: number;
  /** Datos densos crudos del día (buffer de bytes) */
  dense_data_one_day?: { type?: string; data?: number[] };
  /** Datos densos parseados con registros horarios individuales */
  dense_data_parsed?: IDenseDataParsed;
  /** Ciclo de adquisición de datos densos en minutos (15, 30, 60, etc.) */
  daily_dense_data_acquisition_cycle?: number;
  for_test_dept?: number;
  /** Habilita el reporte activo de alarmas (0: deshabilitado, 1: habilitado, 2: solo primera) */
  enables_active_alarm_reporting_flag?: number;
}
