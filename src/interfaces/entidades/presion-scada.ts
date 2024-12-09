import { ICentroOperativo } from '../gas/centroOperativo';
import { IUnidadNegocio } from '../gas/unidadNegocio';
import { IAlerta, IEstado, ILocalidad, IReporte } from '.';
import { ICliente } from '../tenant';

export interface IPresionScada {
  _id?: string;
  //
  fechaCreacion?: string;
  nombre?: string; /// Input
  tag?: string; /// Esto configura el tag para el OPC
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
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
}

////// CREATE
type OmitirCreate =
  | '_id'
  | 'unidadDeNegocio'
  | 'centroOperativo'
  | 'localidad'
  | 'cliente';
export interface ICreatePresionScada
  extends Omit<Partial<IPresionScada>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | '_id'
  | 'unidadDeNegocio'
  | 'centroOperativo'
  | 'localidad'
  | 'cliente';
export interface IUpdatePresionScada
  extends Omit<Partial<IPresionScada>, OmitirUpdate> {}
