import { ICliente } from "../tenant";

export type TipoDispositivoFirmware = "NSP" | "NUC";
export interface IFirmware {
  _id?: string;
  idCliente?: string;
  fechaCreacion?: string;
  version?: string;
  dispositivo?: TipoDispositivoFirmware;
  archivo?: string;

  // Virtuals
  cliente?: ICliente;
}

// CREATE
type OmitirCreate = "_id" | "cliente";
export interface ICreateFirmware
  extends Omit<Partial<IFirmware>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id" | "cliente";
export interface IUpdateFirmware
  extends Omit<Partial<IFirmware>, OmitirUpdate> {}
