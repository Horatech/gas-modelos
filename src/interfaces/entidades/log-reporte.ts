import { IDeviceInfo, ITenantInfo } from "../auxiliares";
import { IMedidorResidencial } from "./medidor-residencial";
import { IMedidorResidencialAgua } from "./medidor-residencial-agua";
import { IPuntoMedicion } from "./punto-medicion";
import { IUnidadPresion } from "./unidadPresion";
import { IValoresLogReporte } from "./valores-log-reporte";

export interface ILogReporte {
  _id?: string;
  fechaCreacion?: string;
  // Tentant
  tenant?: ITenantInfo;
  // Datos del dispositivo
  device?: IDeviceInfo;
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados?: string[];
  // Datos especificos de acuerdo al tipo de dispositivo
  valores?: IValoresLogReporte;

  // Virtuals
  puntoMedicion?: IPuntoMedicion;
  unidadPresion?: IUnidadPresion;
  medidorResidencial?: IMedidorResidencial;
  medidorResidencialAgua?: IMedidorResidencialAgua;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "puntoMedicion"
  | "unidadPrsion"
  | "medidorResidencial";
export interface ICreateLogReporte
  extends Omit<Partial<ILogReporte>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "puntoMedicion"
  | "unidadPrsion"
  | "medidorResidencial";
export interface IUpdateLogReporte
  extends Omit<Partial<ILogReporte>, OmitirUpdate> {}
