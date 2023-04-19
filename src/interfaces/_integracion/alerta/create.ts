import { IDeviceInfo } from "../auxiliares/deviceInfo";
import { ITenantInfo } from "../auxiliares/tenentInfo";

export interface ICreateAlerta {
  fechaCreacion?: string;
  // Tentant
  tenant?: ITenantInfo;
  // Datos del dispositivo
  device?: IDeviceInfo;
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados?: string[];
  // Datos especificos de acuerdo al tipo de dispositivo
  // valores?: any;
}
