import { IDeviceInfo, ITenantInfo } from "../auxiliares";
import { IPuntoMedicion } from "./punto-medicion";
import { IUnidadPresion } from "./unidadPresion";
import { IValoresReporte } from "./valores reporte/valoresReporte";

export interface IReporte {
  _id?: string;
  fechaCreacion?: string;
  // Tentant
  tenant?: ITenantInfo;
  // Datos del dispositivo
  device?: IDeviceInfo;
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados?: string[];
  // Datos especificos de acuerdo al tipo de dispositivo
  valores?: IValoresReporte;

  // Virtuals
  puntoMedicion?: IPuntoMedicion;
  unidadPresion?: IUnidadPresion;
}

////// CREATE
type OmitirCreate = "_id" | "puntoMedicion" | "unidadPrsion";
export interface ICreateReporte extends Omit<Partial<IReporte>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = "_id" | "puntoMedicion" | "unidadPrsion";
export interface IUpdateReporte extends Omit<Partial<IReporte>, OmitirUpdate> {}
