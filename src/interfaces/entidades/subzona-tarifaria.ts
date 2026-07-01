import { ICentroOperativo, IUnidadNegocio } from '../gas';
import { Division } from '../tenant';
import { ILocalidad } from './localidad';

export interface ISubzonaTarifaria {
  _id?: string;
  nombre?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string; // vínculo obligatorio con la Localidad
  posicion?: number; // para ordenar en las pantallas
  division?: Division; // siempre 'Residencial'
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
}

// CREATE
type OmitirCreate = '_id' | 'unidadNegocio' | 'centroOperativo' | 'localidad';
export interface ICreateSubzonaTarifaria
  extends Omit<Partial<ISubzonaTarifaria>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = '_id' | 'unidadNegocio' | 'centroOperativo' | 'localidad';
export interface IUpdateSubzonaTarifaria
  extends Omit<Partial<ISubzonaTarifaria>, OmitirUpdate> {}
