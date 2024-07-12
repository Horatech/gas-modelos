import { IReporte } from "./reporte";
import { IEstado } from "./correctora";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IAlerta } from "./alerta";
import { IDispositivo } from "./dispositivo";
import { ILocalidad } from "./localidad";

export interface IUnidadPresion {
  _id?: string;
  fechaCreacion?: string;
  //
  modelo?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  //
  ultimoRegistro?: IReporte;
  ultimaAlerta?: IAlerta;
  //
  estadoActual?: IEstado;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
  dispositivo?: IDispositivo;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "dispositivo";
export interface ICreateUnidadPresion
  extends Omit<Partial<IUnidadPresion>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "dispositivo";
export interface IUpdateUnidadPresion
  extends Omit<Partial<IUnidadPresion>, OmitirUpdate> {}
