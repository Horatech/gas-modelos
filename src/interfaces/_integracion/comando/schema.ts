import { IDeviceInfo } from "../auxiliares/deviceInfo";
import { ITenantInfo } from "../auxiliares/tenentInfo";
import { IEstadoComando } from "./estadoComando";
import { IValoresComando } from "./valoresComando";

export interface IAlertaComando {
  _id?: string;
  fechaCreacion?: string;
  // Tentant
  tenant?: ITenantInfo;
  // Datos del dispositivo
  device?: IDeviceInfo;
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados?: string[];
  valores?: IValoresComando;
  estado?: IEstadoComando;
  // Usuario que envió el comando
  idUsuario?: string;
}
