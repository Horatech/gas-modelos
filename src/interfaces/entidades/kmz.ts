import { ICliente } from "../tenant";

export interface IKmz {
  _id?: string;
  idCliente?: string;
  nombre?: string;
  urlKmz?: string;

  // Virtuals
  cliente?: ICliente;
}

// CREATE
type OmitirCreate = "_id" | "cliente";
export interface ICreateKmz extends Omit<Partial<IKmz>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id" | "cliente";
export interface IUpdateKmz extends Omit<Partial<IKmz>, OmitirUpdate> {}
