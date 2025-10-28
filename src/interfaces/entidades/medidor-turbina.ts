import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { IRegistro } from "./registro";
import {
  IAlerta,
  IAlertaGpio,
  ICromatografia,
  IDispositivo,
  IEstado,
  IEventoGpio,
  ILocalidad,
  ModeloCorrectora,
} from ".";

export type modeloTurbina = "Clasico" | "AltaCapacidad";

export interface IMedidorTurbina {
  _id?: string;
  //
  firmware?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  modelo?: ModeloCorrectora;
  fechaCreacion?: string;
  bateria?: number;
  consumoInicial?: number;
  tipo?: modeloTurbina;
  //
  ultimoRegistro?: IRegistro;
  ultimaAlerta?: IAlerta;
  ultimaCromatografia?: ICromatografia;
  fechaUltimaCromatografia?: string;
  // GPIO (NUC v2.0)
  ultimoEventoGpio?: IEventoGpio;
  ultimaAlertaGpio?: IAlertaGpio;
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
export interface ICreateMedidorTurbina
  extends Omit<Partial<IMedidorTurbina>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "dispositivo";
export interface IUpdateMedidorTurbina
  extends Omit<Partial<IMedidorTurbina>, OmitirUpdate> {}
