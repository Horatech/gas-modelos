export interface IDispositivoNuc4G {
  // Lo que viene en set configuracion
  deveui: string;
  appkey: string;
  firmwareNuc: string;
  apiVersion: string;
  horaInicio: number;
  modoOperacion: "REG1_DIARIO" | "REG24_DIARIO" | "REG8_8HORAS";
  modoEnv: "TEST" | "PROD";
  claveMercury: string;
  modoRegistros: "REG_TOTALIZADOS" | "REG_PARCIALES";
  iccid: number;
  operadora: string;
  nsa: number;
  voltajeBateria: number;
  versionHardware: string;
  //
  frecuenciaComunicacion?: number;
  redPreferida?: string;
  desfaceHorario?: number; // Min
}
