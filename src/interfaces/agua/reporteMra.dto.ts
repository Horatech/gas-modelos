export interface ICreateReporteMra {
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
  fecha: string;
  idCliente: string;
  deveui: string;
  deviceName?: string;
  idUnidadNegocio?: string;
}
