import { ICentroOperativo, IUnidadNegocio } from "../gas";
import { Division } from "../tenant";

export interface IGrupo {
  _id?: string;
  nombre?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  division?: Division;
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
}

// CREATE
type OmitirCreate = "_id" | "unidadNegocio" | "centroOperativo";
export interface ICreateGrupo extends Omit<Partial<IGrupo>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id" | "unidadNegocio" | "centroOperativo";
export interface IUpdateGrupo extends Omit<Partial<IGrupo>, OmitirUpdate> {}
