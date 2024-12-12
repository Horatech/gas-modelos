import {
  ICorrectora,
  ILocalidad,
  IScada,
  IPuntoMedicion,
  IUnidadPresion,
} from '.';
import { ICliente } from '../tenant';
import { ICentroOperativo } from '../gas/centroOperativo';
import { IUnidadNegocio } from '../gas/unidadNegocio';

export type IEstadoAlerta = 'Cerrado' | 'Activo';
export type ITipoAlerta =
  | 'Sin Reportar'
  | 'Valor Alto'
  | 'Valor Bajo'
  | 'Fuera de rango'
  | 'Error de comunicación'
  | 'Sensor desconectado';

export interface IAlerta {
  _id?: string;
  deveui?: string;
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
  idPresionScada?: string;
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
}

////// CREATE
type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'unidadDeNegocio'
  | 'centroOperativo'
  | 'localidad'
  | 'puntoMedicion'
  | 'unidadPresion'
  | 'correctora'
  | 'scada';
export interface ICreateAlerta extends Omit<Partial<IAlerta>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'unidadDeNegocio'
  | 'centroOperativo'
  | 'localidad'
  | 'puntoMedicion'
  | 'unidadPresion'
  | 'correctora'
  | 'scada';
export interface IUpdateAlerta extends Omit<Partial<IAlerta>, OmitirUpdate> {}
