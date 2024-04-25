import { IDispositivo } from "../entidades";
import { TipoDispositivo } from "./tipoDispositivo";

export interface IDeviceInfo {
  name?: string;
  deveui?: string;
  tipo?: TipoDispositivo;

  // Virtual
  dispositivo?: IDispositivo;
}
