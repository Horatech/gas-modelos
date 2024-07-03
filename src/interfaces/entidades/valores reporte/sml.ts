export interface IReporteSML {
  tipo?: "SindCon" | "Hac";
  header?: number;
  paquetSequence?: number;
  deviceMeterNumber?: number;
  pulseConstant?: number;
  meterType?: number;
  meteringMode?: number;
  batteryVoltage?: number;
  statusWord?: number;
  triggerSource?: number;
  checksum?: number;
  // Parsed
  consumo?: number;
  consumoNegativo?: number;
  bateria?: number;
}
