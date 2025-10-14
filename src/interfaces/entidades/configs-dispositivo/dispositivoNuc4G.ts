import { TipoEntradaDigital } from "../config-dispositivo";

export interface IDispositivoNuc4G {
  // Lo que viene en set configuracion
  deveui?: string;
  appkey?: string;
  firmwareNuc?: string;
  apiVersion?: string;
  horaInicio?: number;
  modoOperacion?: "REG1_DIARIO" | "REG24_DIARIO" | "REG8_8HORAS";
  modoEnv?: "TEST" | "PROD";
  claveMercury?: string;
  modoRegistros?: "REG_TOTALIZADOS" | "REG_PARCIALES";
  iccid?: number;
  operadora?: string;
  telefono?: string;
  nsa?: number;
  voltajeBateria?: number;
  versionHardware?: string;
  //
  frecuenciaComunicacion?: number;
  redPreferida?: string;
  desfaceHorario?: number; // Min

  // Configuración GPIO (NUC v2.0)
  in1Type?: TipoEntradaDigital;
  in2Type?: TipoEntradaDigital;
  outputActivo?: boolean;
  timestampActivacion?: number; // Segundos desde 00:00:00 del día
  tiempoActivacion?: number; // Segundos que debe estar activada
}
