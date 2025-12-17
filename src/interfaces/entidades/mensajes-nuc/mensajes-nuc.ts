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
  // Teléfonos para alertas SMS (NUC v2.0)
  telefono1?: string; // Formato: +54XXXXXXXXXXX (13 caracteres)
  telefono2?: string; // Formato: +54XXXXXXXXXXX (13 caracteres)
  telefono3?: string; // Formato: +54XXXXXXXXXXX (13 caracteres)
  // Configuración GPIO (NUC v2.0)
  tipo_input_1?: number;
  tipo_edge_input_1?: number; // Tipo de detección de flanco (0-5)
  tipo_input_2?: number;
  tipo_edge_input_2?: number; // Tipo de detección de flanco (0-5)
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

export interface ISyncHora {
  deveui?: string;
  appkey?: string;
  firmwareNuc: string;
  apiVersion: string;
  timestamp?: number;
  forzarSync?: boolean; // Fuerza respuesta del servidor independiente de configuración
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
  Elcor,
}

export type ModeloCorrectora =
  | "Nada"
  | "Corus"
  | "Dresser1"
  | "Dresser2"
  | "Proser"
  | "Mercury"
  | "Minicor"
  | "AmericanMeter"
  | "Elcor"
  | "Instromet";

export const modelosCorrectoras: ModeloCorrectora[] = [
  "Nada",
  "Corus",
  "Dresser1",
  "Dresser2",
  "Proser",
  "Mercury",
  "Minicor",
  "AmericanMeter",
  "Elcor",
  "Instromet",
];

/// GPIO - NUC v2.0
// - Testigos de inputs
export interface ISetReporteGpio {
  deveui: string;
  appkey: string;
  firmwareNuc: string;
  apiVersion: string;
  data_ios: {
    contador_1?: number;
    contador_2?: number;
    testigo_1?: number; // 0 o 1 según firmware
    testigo_2?: number; // 0 o 1 según firmware
  };
}

export interface ISetAlertaGpio {
  deveui: string;
  appkey: string;
  firmwareNuc: string;
  apiVersion: string;
  alerta: {
    input: 1 | 2;
  };
}

export interface ISetRegistrosInputs {
  deveui: string;
  appkey: string;
  firmwareNuc: string;
  apiVersion: string;
  reg_ios: [number, number, number][]; // Array of [timestamp, contador_input_1, contador_input_2]
}

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
  | "IGetRegistro"
  | "ISyncHora"
  | "ISetReporteGpio"
  | "ISetAlertaGpio"
  | "ISetRegistrosInputs";
