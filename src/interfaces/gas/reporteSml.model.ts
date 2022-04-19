export interface IReporteSml {
  _id: string;
  header: number;
  paquetSequence: number;
  deviceMeterNumber: number;
  pulseConstant: number;
  meterType: number;
  meteringMode: number;
  consumo: number;
  batteryVoltage: number;
  statusWord: number;
  triggerSource: number;
  checksum: number;
  //
  idCliente: string;
  deveui: string;
  deviceName?: string;
  idUnidadNegocio?: string;
  //
}
