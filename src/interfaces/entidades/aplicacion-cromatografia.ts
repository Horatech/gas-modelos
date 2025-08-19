import { ICorrectora, ICromatografia } from ".";
import { IUnidadNegocio } from "../gas";
import { ICuenca } from "./cuenca";

export interface IAplicacionCromatografia {
  _id?: string;
  aplicada?: boolean;
  idCromatografia?: string;
  idCorrectora?: string;
  numeroSerieCorrectora?: string | null;
  fechaCreacion?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCuenca?: string;
  // Virtual
  correctora?: ICorrectora;
  cromatografia?: ICromatografia;
  unidadNegocio?: IUnidadNegocio;
  cuenca?: ICuenca;
}

// CREATE
type OmitirCreate =
  | "_id"
  | "fechaCreacion"
  | "correctora"
  | "cromatografia"
  | "unidadNegocio"
  | "cuenca";
export interface ICreateAplicacionCromatografia
  extends Omit<Partial<IAplicacionCromatografia>, OmitirCreate> {}

// UPDATE
type OmitirUpdate =
  | "_id"
  | "fechaCreacion"
  | "correctora"
  | "cromatografia"
  | "unidadNegocio"
  | "cuenca";
export interface IUpdateAplicacionCromatografia
  extends Omit<Partial<IAplicacionCromatografia>, OmitirUpdate> {}
