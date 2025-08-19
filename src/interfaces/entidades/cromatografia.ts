import { IUnidadNegocio } from "../gas";
import { IUsuario } from "../tenant";
import { ICuenca } from "./cuenca";

export interface IElementos {
  oxigeno?: number;
  densidad?: number;
  dioxidoCarbono?: number;
  nitrogeno?: number;
  metano?: number;
  etano?: number;
  propano?: number;
  isoButano?: number;
  nButano?: number;
  isoPentano?: number;
  nPentano?: number;
  nHexano?: number;
  nHeptano?: number;
  nOctano?: number;
}

export interface ICromatografia {
  _id?: string;
  idUsuario?: string;
  idCuenca?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  fechaAplicacion?: string;
  fechaVencimiento?: string;
  elementos?: IElementos;
  //
  fechaCreacion?: string;
  // Virtual
  cuenca?: ICuenca;
  unidadNegocio?: IUnidadNegocio;
  usuario?: IUsuario;
}

// CREATE
type OmitirCreate =
  | "_id"
  | "fechaCreacion"
  | "cuenca"
  | "unidadNegocio"
  | "usuario";
export interface ICreateCromatografia
  extends Omit<Partial<ICromatografia>, OmitirCreate> {}

// UPDATE
type OmitirUpdate =
  | "_id"
  | "fechaCreacion"
  | "cuenca"
  | "unidadNegocio"
  | "usuario";
export interface IUpdateCromatografia
  extends Omit<Partial<ICromatografia>, OmitirUpdate> {}
