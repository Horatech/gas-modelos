import { IDeviceInfo } from "../auxiliares/deviceInfo";
import { ITenantInfo } from "../auxiliares/tenentInfo";
import { IEstadoAlerta } from "./estadoAlerta";
import { IValoresAlerta } from "./valoresAlerta";

export interface IAlerta {
  _id?: string;
  fechaCreacion?: string;
  // Tentant
  tenant?: ITenantInfo;
  // Datos del dispositivo
  device?: IDeviceInfo;
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados?: string[];
  // Datos especificos de acuerdo al tipo de dispositivo
  valores?: IValoresAlerta;
  estado?: IEstadoAlerta;
}
