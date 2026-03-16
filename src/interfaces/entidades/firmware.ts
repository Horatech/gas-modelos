export type TipoDispositivoFirmware = "NSP" | "NUC";
export type VersionHardware = "v2" | "v3";
export interface IFirmware {
  _id?: string;
  fechaCreacion?: string;
  version?: string;
  versionHardware?: VersionHardware;
  dispositivo?: TipoDispositivoFirmware;
  archivo?: string;
}

// CREATE
type OmitirCreate = "_id";
export interface ICreateFirmware extends Omit<
  Partial<IFirmware>,
  OmitirCreate
> {}

// UPDATE
type OmitirUpdate = "_id";
export interface IUpdateFirmware extends Omit<
  Partial<IFirmware>,
  OmitirUpdate
> {}
