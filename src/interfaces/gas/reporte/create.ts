import { IDeviceInfo, ITenantInfo } from "../../auxiliares";
import { IValoresReporte } from "./valores reporte/valoresReporte";

export interface ICreateReporte {
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
