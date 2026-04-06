import { IDeviceInfo, ITenantInfo } from "../auxiliares";
import { ICorrectora } from "./correctora";
import { IMedidorResidencial } from "./medidor-residencial";
import { IMedidorResidencialAgua } from "./medidor-residencial-agua";
import { IScada } from "./scada";
import { IPuntoMedicion } from "./punto-medicion";
import { IUnidadPresion } from "./unidad-presion";
import { IValoresReporte } from "./valores-reporte/valoresReporte";
import {
  IDispositivoExternoNuc,
  TipoInputDispositivoExterno,
} from "./dispositivo-externo-nuc";

export type reporteTypes =
  | TipoInputDispositivoExterno
  | "Presion"
  | "Residencial"
  | "Residencial Agua"
  | "Scada";

export interface IReporte {
  _id?: string;
  fechaCreacion?: string;
  // Tentant
  tenant?: ITenantInfo;
  // Datos del dispositivo
  device?: IDeviceInfo;
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados?: string[];
  idsAsignadosHash?: string; // Esto es un string para usar como indice unico los ids asignados
  // Datos especificos de acuerdo al tipo de dispositivo
  valores?: IValoresReporte;
  tipoReporte?: reporteTypes;

  // Virtuals
  puntoMedicion?: IPuntoMedicion;
  dispositivoExterno?: IDispositivoExternoNuc;
  unidadPresion?: IUnidadPresion;
  medidorResidencial?: IMedidorResidencial;
  medidorResidencialAgua?: IMedidorResidencialAgua;
  scada?: IScada;
}

////// CREATE
type Omitir =
  | "_id"
  | "puntoMedicion"
  | "dispositivoExterno"
  | "unidadPrsion"
  | "medidorResidencial"
  | "medidorResidencialAgua"
  | "scada";
export interface ICreateReporte extends Omit<Partial<IReporte>, Omitir> {}

export interface IUpdateReporte extends Omit<Partial<IReporte>, Omitir> {}
