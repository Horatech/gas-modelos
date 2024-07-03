export interface IReporteSML {
  tipo?: "SindCon" | "Hac";
  header?: number;
  paquetSequence?: number;
  deviceMeterNumber?: number;
  pulseConstant?: number;
  meterType?: number;
  meteringMode?: number;
  meter_reading?: number;
  reverse_accumulated_flow?: number;
  batteryVoltage?: number;
  statusWord?: number;
  triggerSource?: number;
  checksum?: number;
  // Parsed
  timestamp?: string;
  consumo?: number;
  consumoNegativo?: number;
  bateria?: number;
}
