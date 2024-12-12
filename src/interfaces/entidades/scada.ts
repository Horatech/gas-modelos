import { ICentroOperativo } from '../gas/centroOperativo';
import { IUnidadNegocio } from '../gas/unidadNegocio';
import { IAlerta, IEstado, ILocalidad, IReporte } from '.';
import { ICliente } from '../tenant';

export type TipoScada = 'Presión' | 'Temperatura';

export interface IScada {
  _id?: string;
  //
  fechaCreacion?: string;
  nombre?: string; /// Input
  tag?: string; /// Esto configura el tag para el OPC
  tipo?: TipoScada;
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

type Omitir =
  | '_id'
  | 'unidadDeNegocio'
  | 'centroOperativo'
  | 'localidad'
  | 'cliente';

export interface ICreatePresionScada extends Omit<Partial<IScada>, Omitir> {}

export interface IUpdatePresionScada extends Omit<Partial<IScada>, Omitir> {}
