import { IUnidadNegocio } from "../gas";

export interface ICuenca {
  _id?: string;
  nombre?: string;
  idUnidadNegocio?: string;
  idCliente?: string;
  // Virtual
  unidadNegocio?: IUnidadNegocio;
}

// CREATE
type OmitirCreate = "_id" | "unidadNegocio";
export interface ICreateCuenca extends Omit<Partial<ICuenca>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id" | "unidadNegocio";
export interface IUpdateCuenca extends Omit<Partial<ICuenca>, OmitirUpdate> {}
