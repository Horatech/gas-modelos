import { ICentroOperativo, IUnidadNegocio } from "../gas";
import { ICliente } from "../tenant";

export interface IKmz {
  _id?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  nombre?: string;
  urlKmz?: string;

  // Virtuals
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
}

// CREATE
type OmitirCreate = "_id" | "cliente" | "unidadNegocio" | "centroOperativo";
export interface ICreateKmz extends Omit<Partial<IKmz>, OmitirCreate> {}

// UPDATE
type OmitirUpdate =
  | "_id"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "idCliente";
export interface IUpdateKmz extends Omit<Partial<IKmz>, OmitirUpdate> {}
