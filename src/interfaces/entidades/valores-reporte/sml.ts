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
  // Código de unidad de caudal del medidor (byte de unidad de la trama, familia
  // ML107A Reallin/HolleyBeta). Determina el factor de escala del flujo acumulado
  // a m³. Enum del fabricante: 0x29 L (÷1000), 0x2A L×10 (÷100), 0x2B L×100 (÷10),
  // 0x2C m³ (×1), 0x2D m³×10 (×10), 0x2E m³×100 (×100). Se persiste el código crudo
  // para trazabilidad; el consumo ya viene escalado con el factor correspondiente.
  unidad?: number;
  triggerSource?: number;
  checksum?: number;
  // Parsed
  timestamp?: string;
  consumoNegativo?: number; // Es el consumo acumulado en sentido negativo reportado por el dispositivo
  consumoPositivo?: number; // Es el consumo acumulado en sentido positivo reportado por el dispositivo
  consumo?: number; // Es el consumo acumulado reportado por el dispositivo // restando lo negativo
  consumoCorregido?: number; // Es el consumo acumulado +- el consumo incial cargado en la plataforma
  // Consumo del período: consumoCorregido de este reporte - consumoCorregido del
  // último reporte del medidor. El dispositivo SML/MRA reporta el acumulado
  // (odómetro), no el parcial, así que se CALCULA en el backend (misma convención
  // que OCR/NUC/agua). undefined en el primer reporte (sin acumulado anterior).
  consumoParcial?: number;
  consumoInstantaneo?: number; // Es el consumo instantaneo reportado por el dispositivo
  bateria?: number;
}
