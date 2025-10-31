import {
  ICorrectora,
  ILocalidad,
  IScada,
  IPuntoMedicion,
  IUnidadPresion,
  IMedidorResidencial,
  IMedidorResidencialAgua,
} from ".";
import { ICliente } from "../tenant";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";

export type IEstadoAlerta = "Cerrado" | "Activo";
export type ITipoAlerta =
  | "Sin Reportar"
  | "Valor Alto"
  | "Valor Bajo"
  | "Fuera de rango"
  | "Error de comunicación"
  | "Sensor desconectado"
  | "Batería baja"
  | "Ataque magnético";

export interface IAlerta {
  _id?: string;
  deveui?: string;
  tag?: string;
  deviceName?: string;
  firmwareNuc?: string;
  apiVersion?: string;
  numeroAlerta?: number;
  timestamp?: string;
  mensaje?: string;
  estado?: IEstadoAlerta;
  tipo?: ITipoAlerta;
  fechaCierre?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idPuntoMedicion?: string;
  idUnidadPresion?: string;
  idCorrectora?: string;
  idMedidorResidencial?: string;
  idMedidorResidencialAgua?: string;
  idScada?: string;
  idMedidorTurbina?: string;
  numeroSerieCorrectora?: string | null;
  //
  fechaCreacion?: string;
  // Virtuals
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
  puntoMedicion?: IPuntoMedicion;
  unidadPresion?: IUnidadPresion;
  correctora?: ICorrectora;
  scada?: IScada;
  medidorResidencial?: IMedidorResidencial;
  medidorResidencialAgua?: IMedidorResidencialAgua;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad"
  | "puntoMedicion"
  | "unidadPresion"
  | "correctora"
  | "scada"
  | "medidorResidencial"
  | "medidorResidencialAgua";
export interface ICreateAlerta extends Omit<Partial<IAlerta>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad"
  | "puntoMedicion"
  | "unidadPresion"
  | "correctora"
  | "scada"
  | "medidorResidencial"
  | "medidorResidencialAgua";
export interface IUpdateAlerta extends Omit<Partial<IAlerta>, OmitirUpdate> {}
