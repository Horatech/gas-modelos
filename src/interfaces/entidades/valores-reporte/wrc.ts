export interface IReporteWRC {
  device_information?: DeviceInformation;
  fix_iot?: FixIot;
  meter_info?: MeterInfo;
  valve?: FixIot;
  alarm?: Alarm;
  // Parsed
  timestamp?: string;
  consumoCorregido?: number; // Es el consumo acumulado reportado por el dispositvo +- el consumo incial cargado en la plataforma
  consumoInstantaneo?: number; // Es el consumo instantaneo reportado por el dispositivo
  consumo?: number; // Es el consumo acumulado reportado por el dispositivo
  consumoNegativo?: number; // Es el consumo acumulado en sentido negativo reportado por el dispositivo
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
  daily_dense_data_acquisition_cycle?: number;
  for_test_dept?: number;
  /** Habilita el reporte activo de alarmas (0: deshabilitado, 1: habilitado, 2: solo primera) */
  enables_active_alarm_reporting_flag?: number;
}
