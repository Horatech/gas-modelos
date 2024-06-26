export interface IReporteWRC {
  device_information?: DeviceInformation;
  fix_iot?: FixIot;
  meter_info?: MeterInfo;
  valve?: FixIot;
  alarm?: Alarm;
  timestamp?: string;
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
  dense_data_one_day?: { type?: string; data?: number[] };
  daily_dense_data_acquisition_cycle?: number;
  for_test_dept?: number;
}

type OmitirCreate = '_id';
export interface ICreateReporteWRC
  extends Omit<Partial<IReporteWRC>, OmitirCreate> {}

type OmitirUpdate = '_id';

export interface IUpdateReporteWRC
  extends Omit<Partial<IReporteWRC>, OmitirUpdate> {}
