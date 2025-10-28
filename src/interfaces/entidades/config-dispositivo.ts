import { TipoDispositivo } from "../auxiliares";
import { IDispositivo } from "./dispositivo";
import { IScada } from "./scada";

export type TipoEntradaDigital = "CONTADOR" | "FLAG" | "ALERTA" | "EN_DESUSO";

export type TipoEdgeDeteccion =
  | "NONE"     // 0 - Sin detección
  | "FALLING"  // 1 - Flanco descendente
  | "RISING"   // 2 - Flanco ascendente
  | "BOTH"     // 3 - Ambos flancos
  | "LOW"      // 4 - Nivel bajo (continuo)
  | "HIGH";    // 5 - Nivel alto (continuo)

export interface IConfigDispositivoNUC4G {
  horaInicio?: number;
  modoOperacion?: "REG1_DIARIO" | "REG24_DIARIO" | "REG8_8HORAS";
  modoEnv?: "TEST" | "PROD";
  claveMercury?: string;
  modoRegistros?: "REG_TOTALIZADOS" | "REG_PARCIALES";
  nsa?: number; // Numero de serie de american meter
  syncHora?: boolean;

  // Configuración GPIO (NUC v2.0)
  in1Type?: TipoEntradaDigital;
  in1EdgeType?: TipoEdgeDeteccion; // Tipo de detección de flanco para IN1
  in2Type?: TipoEntradaDigital;
  in2EdgeType?: TipoEdgeDeteccion; // Tipo de detección de flanco para IN2
  outputActivo?: boolean;
  timestampActivacion?: number; // Segundos desde 00:00:00 del día
  tiempoActivacion?: number; // Segundos que debe estar activada

  // Teléfonos para alertas SMS (NUC v2.0)
  telefono1?: string; // Formato: +54XXXXXXXXXXX (13 caracteres)
  telefono2?: string; // Formato: +54XXXXXXXXXXX (13 caracteres)
  telefono3?: string; // Formato: +54XXXXXXXXXXX (13 caracteres)
}

export interface IConfigDispositivoNSP4G {
  limiteMin?: number;
  limiteMax?: number;
  horaUTC?: number;
  horaInicio?: number;
  modoEnv?: "TEST" | "PROD";
  modoOperacion?:
    | "REG1_DIARIO"
    | "REG24_DIARIO"
    | "REG1_1HORA"
    | "REG2_2HORAS"
    | "REG3_3HORAS"
    | "REG4_4HORAS"
    | "REG6_6HORAS"
    | "REG8_8HORAS"
    | "REG12_12HORAS";
  timestampBloqueo?: number;
  telefono1?: string;
  telefono2?: string;
  telefono3?: string;
  lugar?: string;
  iccid?: string;
  apn?: string;
  user?: string;
  pass?: string;
  estadoAPN?: boolean;
  operadora?: string;
}

export interface IConfigDispositivoVeribox {
  telefono?: string;
  frecuenciaComunicacion?: number;
  limiteMin?: number;
  limiteMax?: number;
  apn?: string;
  usuario?: string;
  clave?: string;
  // Fecha de Aplicación
  fechaAplicacion?: string;
}

export interface IConfigDispositivoScada {
  limiteHH?: number;
  limiteH?: number;
  limiteLL?: number;
  limiteL?: number;
  // Min-Max para los gráficos.
  minimo?: number;
  maximo?: number;
  // Textos para los booleanos
  textoTrue?: string;
  textoFalse?: string;
  // Fecha de Aplicación
  fechaAplicacion?: string;
}

export interface IConfigDispositivo {
  // Info autogenerada
  _id?: string;
  idCliente?: string;
  // Info de carga
  fechaCreacion?: string;
  fechaAplicacion?: string;
  deveui?: string;
  tag?: string; // Para los SCADA
  tipo?: TipoDispositivo;
  config?: Record<string, any>;
  // Virtuals
  dispositivo?: IDispositivo;
  scada?: IScada;
}

// CREATE
type OmitirCreate = "_id" | "dispositivo";
export interface ICreateConfigDispositivo
  extends Omit<Partial<IConfigDispositivo>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id" | "dispositivo";
export interface IUpdateConfigDispositivo
  extends Omit<Partial<IConfigDispositivo>, OmitirUpdate> {}
