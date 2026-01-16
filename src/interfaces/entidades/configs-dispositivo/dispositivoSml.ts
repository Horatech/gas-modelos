export interface IDispositivoSml {
  // Comunicacion
  imei?: string;
  ip?: string; // IP desde la cual se comunica el dispositivo
  port?: number;

  // Info de la sim
  iccid?: number;
  operadora?: string;
  telefono?: string;

  // Configuracion del SML
  // valveControl?: boolean;
  calibrationDeviceNodeReading?: number;
  reportingCycleInterval?: number; // Segundos
  timezone?: string; // UTC+2 | UTC-3 | etc.
  ipReporte?: string; // La IP de a donde va a reportar -> 47.92.222.233 :1822
  pn?: number; // Pulse number
  maximunMeterReading?: number; // Valor maximo del medidor
  reportingRange?: number; // 321: 0321 3--3+21/2 ,Means to report randomly in the range of 3-13:30
}
