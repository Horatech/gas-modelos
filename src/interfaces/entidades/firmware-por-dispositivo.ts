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
type OmitirCreate = "_id" | "dispositivo" | "firmware" | "fechaCreacion";
export interface ICreateFirmwarePorDispositivo
  extends Omit<Partial<IFirmwarePorDispositivo>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id" | "dispositivo" | "firmware" | "fechaCreacion";
export interface IUpdateFirmwarePorDispositivo
  extends Omit<Partial<IFirmwarePorDispositivo>, OmitirUpdate> {}
