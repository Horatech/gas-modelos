import { ICliente } from "../tenant";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";

export interface ILocalidad {
  _id?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;

  nombre?: string;

  // Virtuals
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
}

// CREATE
type OmitirCreate = "_id";
export interface ICreateLocalidad
  extends Omit<Partial<ILocalidad>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id";
export interface IUpdateLocalidad
  extends Omit<Partial<ILocalidad>, OmitirUpdate> {}
