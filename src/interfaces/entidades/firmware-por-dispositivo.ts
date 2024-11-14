import { IDispositivo } from "./dispositivo";
import { IFirmware, TipoDispositivoFirmware } from "./firmware";

export interface IFirmwarePorDispositivo {
  _id?: string;
  idDispositivo?: string;
  idFirmware?: string;
  tipo?: TipoDispositivoFirmware;
  fechaCreacion?: string;
  version?: string;
  // Populate
  dispositivo?: IDispositivo;
  firmware?: IFirmware;
}

// CREATE
type OmitirCreate = "_id" | "cliente" | "firmware" | "fechaCreacion";
export interface ICreateFirmwarePorCliente
  extends Omit<Partial<IFirmwarePorDispositivo>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id" | "cliente" | "firmware" | "fechaCreacion";
export interface IUpdateFirmwarePorCliente
  extends Omit<Partial<IFirmwarePorDispositivo>, OmitirUpdate> {}
