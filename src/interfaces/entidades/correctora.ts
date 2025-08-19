import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { IRegistro } from "./registro";
import {
  IAlerta,
  ICromatografia,
  IDispositivo,
  ILocalidad,
  ModeloCorrectora,
} from ".";

export type IEstado =
  | "Sin Asignar"
  | "En Mantenimiento"
  | "Resolver"
  | "Sin Reportar"
  | "Operativa"
  | "Alerta"
  | "Sin Comunicación"
  | "Dado de Baja"
  | "Incompleto";

export interface ICorrectora {
  _id?: string;
  //
  firmware?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  modelo?: ModeloCorrectora;
  fechaCreacion?: string;
  bateria?: number;
  //
  ultimoRegistro?: IRegistro;
  ultimaAlerta?: IAlerta;
  ultimaCromatografia?: ICromatografia;
  fechaUltimaCromatografia?: string;
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
export interface ICreateCorrectora
  extends Omit<Partial<ICorrectora>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "dispositivo";
export interface IUpdateCorrectora
  extends Omit<Partial<ICorrectora>, OmitirUpdate> {}
