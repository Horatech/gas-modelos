import { IDeviceInfo, ITenantInfo } from "../auxiliares";
import { ICorrectora } from "./correctora";
import { IMedidorResidencial } from "./medidor-residencial";
import { IMedidorResidencialAgua } from "./medidor-residencial-agua";
import { IPuntoMedicion } from "./punto-medicion";
import { IUnidadPresion } from "./unidad-presion";

export type TipoMensajeTwilio = "sms" | "whatsapp" | "llamada";

export interface ILogTwilio {
  _id?: string;
  fechaCreacion?: string;
  // Tentant
  tenant?: ITenantInfo;
  // Datos del dispositivo
  device?: IDeviceInfo;
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados?: string[];
  // Datos especificos
  tipo?: TipoMensajeTwilio;
  mensaje?: string;
  telefono?: string;
  respuesta?: string;

  // Virtuals
  puntoMedicion?: IPuntoMedicion;
  correctora?: ICorrectora;
  unidadPresion?: IUnidadPresion;
  medidorResidencial?: IMedidorResidencial;
  medidorResidencialAgua?: IMedidorResidencialAgua;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "puntoMedicion"
  | "correctora"
  | "unidadPrsion"
  | "medidorResidencial";
export interface ICreateLogTwilio
  extends Omit<Partial<ILogTwilio>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "puntoMedicion"
  | "correctora"
  | "unidadPrsion"
  | "medidorResidencial";
export interface IUpdateLogTwilio
  extends Omit<Partial<ILogTwilio>, OmitirUpdate> {}
