import { ICliente } from "../tenant/cliente.model";
import { IFirmware, TipoDispositivoFirmware } from "./firmware";

export interface IFirmwarePorCliente {
  _id?: string;
  idCliente?: string;
  idFirmware?: string;
  tipo?: TipoDispositivoFirmware;
  fechaCreacion?: string;
  version?: string;
  // Populate
  cliente?: ICliente;
  firmware?: IFirmware;
}

// CREATE
type OmitirCreate = "_id" | "cliente" | "firmware" | "fechaCreacion";
export interface ICreateFirmwarePorCliente
  extends Omit<Partial<IFirmwarePorCliente>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id" | "cliente" | "firmware" | "fechaCreacion";
export interface IUpdateFirmwarePorCliente
  extends Omit<Partial<IFirmwarePorCliente>, OmitirUpdate> {}
