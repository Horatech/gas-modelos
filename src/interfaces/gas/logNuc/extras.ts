/// SETS

export interface ISetAlerta {
  deveui: string;
  appkey: string;
  firmwareNuc: string;
  apiVersion: string;
  codigo: number;
}

export interface ISetAlertaV2 {
  deveui: string;
  appkey: string;
  firmwareNuc: string;
  apiVersion: string;
  codigo?: number;
  alarmasMercury?: string;
}
export interface ISetConfiguracion {
  deveui: string;
  appkey: string;
  firmwareNuc: string;
  apiVersion: string;
  frecuenciaComunicacion: number;
  horaInicio: number;
  modoOperacion: string;
  redPreferida: string;
}

export interface ISetConfiguracionV2 {
  deveui?: string;
  appkey?: string;
  firmwareNuc?: string;
  apiVersion?: string;
  horaInicio?: number;
  modoOperacion?: "REG1_DIARIO" | "REG24_DIARIO" | "REG8_8HORAS";
  modoEnv?: "TEST" | "PROD";
  claveMercury?: string;
  modoRegistros?: "REG_TOTALIZADOS" | "REG_PARCIALES";
  nsa?: number; // Numero de serie de american meter
}

export interface ISetCorrectora {
  deveui: string;
  appkey: string;
  numeroSerieCorrectora: number;
  firmwareCorrectora?: string;
  numeroCorrectora?: number;
}
export interface ISetCorrectoraV3 {
  deveui: string;
  appkey: string;
  numeroSerieCorrectora: number;
  firmwareCorrectora?: string;
  numeroCorrectora?: number;
  bateria?: string;
}

export interface ISetCromatografia {
  idCromatografia: string;
  aplicada: boolean;
  numeroSerieCorrectora: number;
  // Tambien llega esto
  deveui: string;
  appkey: string;
  firmwareNuc: string;
  apiVersion: string;
}
export interface ISetRegistro {
  deveui: string;
  timestamp: number;
  corrected?: number;
  uncorrected?: number;
  presion?: number;
  temperatura?: number;
  contador?: number;
  bateria?: number;
}
export interface ISetRegistroV3 {
  deveui: string;
  timestamp: number;
  correctedTotalizado?: number;
  uncorrectedTotalizado?: number;
  correctedParcializado?: number;
  uncorrectedParcializado?: number;
  caudalCorregido?: number;
  caudalNoCorregido?: number;
  presionPromedio?: number;
  temperaturaPromedio?: number;
  bateria?: number;
}

export interface ISetReporte {
  registros: ISetRegistro[];
  recuperado: boolean;
  deveui: string;
  deviceName: string;
  appkey: string;
  bateria: string;
  numeroCorrectora: ucv;
  numeroSerieCorrectora: number;
  firmwareNuc: string;
  firmwareCorrectora: string;
  apiVersion: string;
}

export interface ISetReporteV3 {
  registros: ISetRegistroV3[];
  recuperado: boolean;
  deveui: string;
  deviceName: string;
  appkey: string;
  bateria: string;
  numeroCorrectora: ucv;
  numeroSerieCorrectora: number;
  firmwareNuc: string;
  firmwareCorrectora: string;
  apiVersion: string;
}

/// GETS
export interface IGetConfiguracionV2 {
  deveui?: string;
  appkey?: string;
  numeroSerieCorrectora: number;
  firmwareNuc: string;
  apiVersion: string;
}

export interface IGetCromatografia {
  deveui?: string;
  appkey?: string;
  numeroSerieCorrectora: number;
  firmwareNuc: string;
  apiVersion: string;
}

export interface IResponseGetCromatografia {
  _id: string;
  oxigeno?: number;
  densidad?: number;
  dioxidoCarbono?: number;
  nitrogeno?: number;
  metano?: number;
  etano?: number;
  propano?: number;
  isoButano?: number;
  nButano?: number;
  isoPentano?: number;
  nPentano?: number;
  nHexano?: number;
  nHeptano?: number;
  nOctano?: number;
}

export interface IGetRegistro {
  deveui?: string;
  appkey?: string;
  numeroSerieCorrectora: number;
  numeroCorrectora: number;
  firmwareNuc: string;
  apiVersion: string;
}

export interface IResponseGetRegistro {
  registros: number[];
}

/// EXTRAS

export enum ucv {
  Nada = 0,
  Corus,
  Dresser1,
  Dresser2,
  Proser,
  Mercury,
  Minicor,
  AmericanMeter,
}

export const modelosCorrectoras = [
  "Nada",
  "Corus",
  "Dresser1",
  "Dresser2",
  "Proser",
  "Mercury",
  "Minicor",
  "AmericanMeter",
];

export type TipoMensaje =
  | "ISetAlerta"
  | "ISetAlertaV2"
  | "ISetConfiguracion"
  | "ISetConfiguracionV2"
  | "ISetCorrectora"
  | "ISetCorrectoraV3"
  | "ISetCromatografia"
  | "ISetRegistro"
  | "ISetRegistroV3"
  | "ISetReporte"
  | "ISetReporteV3"
  | "IGetConfiguracionV2"
  | "IGetCromatografia"
  | "IGetRegistro";
