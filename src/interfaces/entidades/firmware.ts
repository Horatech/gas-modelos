export type TipoDispositivoFirmware = "NSP" | "NUC";
export interface IFirmware {
  _id?: string;
  fechaCreacion?: string;
  version?: string;
  dispositivo?: TipoDispositivoFirmware;
  archivo?: string;
}

// CREATE
type OmitirCreate = "_id";
export interface ICreateFirmware
  extends Omit<Partial<IFirmware>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id";
export interface IUpdateFirmware
  extends Omit<Partial<IFirmware>, OmitirUpdate> {}
