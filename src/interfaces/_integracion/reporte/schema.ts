import { ITenantInfo } from "../auxiliares/tenentInfo";
import { IDeviceInfo } from "../auxiliares/deviceInfo";
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
}
