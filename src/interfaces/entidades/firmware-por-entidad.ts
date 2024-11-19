import { ICliente } from "../tenant/cliente.model";
import { IDispositivo } from "./dispositivo";
import { IFirmware, TipoDispositivoFirmware } from "./firmware";

export interface IFirmwarePorEntidad {
  _id?: string;
  idCliente?: string;
  idDispositivo?: string;
  idFirmware?: string;
  tipo?: TipoDispositivoFirmware;
  fechaCreacion?: string;
  version?: string;
  // Populate
  cliente?: ICliente;
  dispositivo?: IDispositivo;
  firmware?: IFirmware;
}

// CREATE
type OmitirCreate =
  | "_id"
  | "cliente"
  | "dispositivo"
  | "firmware"
  | "fechaCreacion";
export interface ICreateFirmwarePorEntidad
  extends Omit<Partial<IFirmwarePorEntidad>, OmitirCreate> {}

// UPDATE
type OmitirUpdate =
  | "_id"
  | "cliente"
  | "dispositivo"
  | "firmware"
  | "fechaCreacion";
export interface IUpdateFirmwarePorEntidad
  extends Omit<Partial<IFirmwarePorEntidad>, OmitirUpdate> {}
