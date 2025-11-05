import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { IRegistro } from "./registro";
import {
  IAlerta,
  IAlertaGpio,
  ICromatografia,
  ICuenca,
  IDispositivo,
  IEstado,
  IEventoGpio,
  IGrupo,
  ILocalidad,
  ModeloCorrectora,
} from ".";

export type modeloTurbina = "Clasico" | "AltaCapacidad";

export interface IConfigTurbina {
  // configuracion para multiplicar los valores de entradas digitales por un factor de correccion
  factorIn1?: number;
  factorIn2?: number;
}

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
  config?: IConfigTurbina;
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
  idCuenca?: string;
  idsGrupos?: string[];
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
  cuenca?: ICuenca;
  grupos?: IGrupo[];
  dispositivo?: IDispositivo;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "cuenca"
  | "grupos"
  | "dispositivo";
export interface ICreateMedidorTurbina
  extends Omit<Partial<IMedidorTurbina>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "cuenca"
  | "grupos"
  | "dispositivo";
export interface IUpdateMedidorTurbina
  extends Omit<Partial<IMedidorTurbina>, OmitirUpdate> {}
