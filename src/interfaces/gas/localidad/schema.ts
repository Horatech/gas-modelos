import { ICliente } from "../../tenant";
import { ICentroOperativo } from "../centroOperativo";
import { IUnidadNegocio } from "../unidadNegocio";

export interface IALocalidad {
  _id?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;

  nombre?: string;

  // Virtuals
  cliente: ICliente;
  unidadNegocio: IUnidadNegocio;
  centroOperativo: ICentroOperativo;
}

type OmitirCreate = "_id";

export interface ICreateLocalidad
  extends Omit<Partial<IALocalidad>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateLocalidad
  extends Omit<Partial<IALocalidad>, OmitirUpdate> {}
