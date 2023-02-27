import { IImagenesCliente } from "./cliente.dto";
import { IIntegracion } from "./integraciones";
import { TipoDispositivo } from "./tipo-dispositivo.model";

export interface ICliente {
  _id: string;
  fechaCreacion: string;
  activo: boolean;
  nombre: string;
  admin: boolean;
  imagenes: IImagenesCliente;
  tiposDispositivo: TipoDispositivo[];
  integraciones?: IIntegracion[];
}
