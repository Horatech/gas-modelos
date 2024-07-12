import { TipoMensaje } from "./mensajes-nuc";

export interface ILogNuc {
  _id?: string;
  deveui?: string;
  tipo?: TipoMensaje;
  body?: object;
  fecha?: string;
  tiempoRespuesta?: number;
  codigoRespuesta?: number;
  respuesta?: object;
}

////// CREATE
type OmitirCreate = "_id";
export interface ICreateLogNuc extends Omit<Partial<ILogNuc>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = "_id";
export interface IUpdateLogNuc extends Omit<Partial<ILogNuc>, OmitirUpdate> {}
