import { ICentroOperativo, IUnidadNegocio } from '../gas';
import { Division } from '../tenant';
import { ILocalidad } from './localidad';

export interface ISubzonaTarifaria {
  _id?: string;
  nombre?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  // Una SZT agrupa varias Localidades; cada Localidad pertenece a lo sumo a
  // una SZT (unicidad enforced en backend).
  idsLocalidades?: string[];
  posicion?: number; // para ordenar en las pantallas
  division?: Division; // siempre 'Residencial'
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidades?: ILocalidad[];
}

// CREATE
type OmitirCreate = '_id' | 'unidadNegocio' | 'centroOperativo' | 'localidades';
export interface ICreateSubzonaTarifaria
  extends Omit<Partial<ISubzonaTarifaria>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = '_id' | 'unidadNegocio' | 'centroOperativo' | 'localidades';
export interface IUpdateSubzonaTarifaria
  extends Omit<Partial<ISubzonaTarifaria>, OmitirUpdate> {}
