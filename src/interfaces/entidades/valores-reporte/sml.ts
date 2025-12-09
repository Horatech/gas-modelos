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
  consumoNegativo?: number; // Es el consumo acumulado en sentido negativo reportado por el dispositivo
  consumoPositivo?: number; // Es el consumo acumulado en sentido positivo reportado por el dispositivo
  consumo?: number; // Es el consumo acumulado reportado por el dispositivo // restando lo negativo
  consumoCorregido?: number; // Es el consumo acumulado +- el consumo incial cargado en la plataforma
  consumoInstantaneo?: number; // Es el consumo instantaneo reportado por el dispositivo
  bateria?: number;
}
