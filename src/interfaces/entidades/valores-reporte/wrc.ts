import { z } from "zod";

export const AlarmSchema = z.object({
  magnetic_attack_status: z.number().optional(),
  historical_magnetic_attack: z.number().optional(),
  anti_tamper_alarm: z.number().optional(),
  historical_anti_tamper_alarm: z.number().optional(),
  leakage_alarm: z.number().optional(),
  over_flow_alarm: z.number().optional(),
  meter_stop_alarm: z.number().optional(),
  reverse_flow_alarm: z.number().optional(),
});
export type Alarm = z.infer<typeof AlarmSchema>;

export const NBDeliverySchema = z.object({
  NBModelVer: z.string().optional(),
  imei: z.string().optional(),
  imsi: z.string().optional(),
  iccid: z.string().optional(),
  IP: z.string().optional(),
  APN: z.string().optional(),
  plmnID: z.string().optional(),
  BandIndicator: z.number().optional(),
  EARFCN: z.number().optional(),
  CellID: z.number().optional(),
  pci: z.number().optional(),
  rsrp: z.number().optional(),
  rsrq: z.number().optional(),
  rssi: z.number().optional(),
  snr: z.number().optional(),
  ECL: z.number().optional(),
  TXPower: z.number().optional(),
  TXTime: z.number().optional(),
  RXTime: z.number().optional(),
  CSQ: z.number().optional(),
  ReadNBInformation: z.number().optional(),
  PSM: z.number().optional(),
  NetworkProtocol: z.number().optional(),
  alternateIP: z.string().optional(),
  changeAlternateIPTimes: z.number().optional(),
});
export type NBDelivery = z.infer<typeof NBDeliverySchema>;

export const DeviceInformationSchema = z.object({
  serial_number: z.string().optional(),
  current_time: z.number().optional(),
  time_zone: z.string().optional(),
  module_name: z.string().optional(),
  power_voltage: z.number().optional(),
  device_type: z.number().optional(),
  hardware_version: z.string().optional(),
  software_version: z.string().optional(),
  battery_status: z.number().optional(),
  message_packet_sequence: z.number().optional(),
});
export type DeviceInformation = z.infer<typeof DeviceInformationSchema>;

export const FixIotSchema = z.object({});
export type FixIot = z.infer<typeof FixIotSchema>;

export const MeterInfoSchema = z.object({
  measurement_mode: z.number().optional(),
  typical_flow: z.number().optional(),
  metering_error_status: z.number().optional(),
  meter_reading: z.number().optional(),
  positive_accumulated_flow: z.number().optional(),
  reverse_accumulated_flow: z.number().optional(),
  pulse_constant: z.number().optional(),
  /** Datos densos crudos del día (buffer de bytes) */
  dense_data_one_day: z
    .object({
      type: z.string().optional(),
      data: z.array(z.number()).optional(),
    })
    .optional(),
  /** Datos densos parseados con registros horarios individuales */
  daily_dense_data_acquisition_cycle: z.number().optional(),
  for_test_dept: z.number().optional(),
  /** Habilita el reporte activo de alarmas (0: deshabilitado, 1: habilitado, 2: solo primera) */
  enables_active_alarm_reporting_flag: z.number().optional(),
});
export type MeterInfo = z.infer<typeof MeterInfoSchema>;

export const ReporteWRCSchema = z.object({
  nb_delivery: NBDeliverySchema.optional(),
  device_information: DeviceInformationSchema.optional(),
  fix_iot: FixIotSchema.optional(),
  meter_info: MeterInfoSchema.optional(),
  valve: FixIotSchema.optional(),
  alarm: AlarmSchema.optional(),
  ip: z.string().optional(),
  port: z.number().optional(),
  // Parsed
  timestamp: z.string().optional(),
  consumoNegativo: z.number().optional(), // Es el consumo acumulado en sentido negativo reportado por el dispositivo
  consumoPositivo: z.number().optional(), // Es el consumo acumulado en sentido positivo reportado por el dispositivo
  consumo: z.number().optional(), // Es el consumo acumulado reportado por el dispositivo // restando lo negativo
  consumoCorregido: z.number().optional(), // Es el consumo acumulado +- el consumo incial cargado en la plataforma
  consumoInstantaneo: z.number().optional(), // Es el consumo instantaneo reportado por el dispositivo
  bateria: z.number().optional(),
});
export type IReporteWRC = z.infer<typeof ReporteWRCSchema>;
