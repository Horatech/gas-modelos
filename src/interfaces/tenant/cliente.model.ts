import { TipoDispositivo } from "../auxiliares";
import { IImagenesCliente } from "./cliente.dto";
import { IIntegracion } from "./integraciones";

export interface ICliente {
  _id?: string;
  fechaCreacion?: string;
  activo?: boolean;
  nombre?: string;
  admin?: boolean;
  imagenes?: IImagenesCliente;
  tiposDispositivo?: TipoDispositivo[];
  integraciones?: IIntegracion[];
}
