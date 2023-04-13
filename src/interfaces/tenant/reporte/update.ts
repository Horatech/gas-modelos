import { IDeviceInfo } from "./deviceInfo";
import { ITenantInfo } from "./tenentInfo";

export interface IUpdateReporte {
  fecha?: string;
  // Tentant
  tenant?: ITenantInfo;
  // Datos del dispositivo
  device?: IDeviceInfo;
  // Ids de otras entidades que tienen asignado el dispositivo que generó el reporte
  idsAsignados?: string[];
  // Datos especificos del reporte de acuerdo al tipo de dispositivo
  reporte?: Record<string, any>;
}
