import { ICentroOperativo } from '../gas/centroOperativo';
import { IUnidadNegocio } from '../gas/unidadNegocio';
import {
  IAlerta,
  IConfigDispositivo,
  IConfigDispositivoScada,
  IEstado,
  ILocalidad,
  IReporte,
} from '.';
import { ICliente } from '../tenant';

export type TipoScada = 'Presión' | 'Temperatura';

export interface IScada {
  _id?: string;
  //
  fechaCreacion?: string;
  nombre?: string; /// Input
  tag?: string; /// Esto configura el tag para el OPC
  tipo?: TipoScada;
  unidad?: string; // Input, para saber que reporta (además del tipo)
  // Booleano
  booleano?: boolean; // Input, para saber si es un valor booleano (Reporta 1 o 0 y andá a saber cuál es cuál)
  booleanoValorAlarma?: boolean; // Input, para saber si el valor de alarma es 1 o 0
  //
  ultimoRegistro?: IReporte;
  ultimaAlerta?: IAlerta;
  //
  habilitado?: boolean;
  estadoActual?: IEstado;
  config?: IConfigDispositivoScada;
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

export interface ICreateScada extends Omit<Partial<IScada>, Omitir> {}

export interface IUpdateScada extends Omit<Partial<IScada>, Omitir> {}
