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
  IInputsRegistrosNUCV2,
  ILocalidad,
  ITestigoNUCV2,
  ModeloCorrectora,
} from ".";

export type modeloTurbina = "Clasico" | "AltaCapacidad";

export interface IConfigTurbina {
  // configuracion para multiplicar los valores de entradas digitales por un factor de correccion
  factorIn1?: number;
  factorIn2?: number;
  consumoInicialIn1?: number; // valor inicial de la entrada digital 1 para calcular el consumo real
  consumoInicialIn2?: number; // valor inicial de la entrada digital 2 para calcular el consumo real
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
  ultimoReporteInput?: IInputsRegistrosNUCV2;
  ultimoReporteTestigo?: ITestigoNUCV2;
  ultimaAlertaInput?: IAlerta;
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
