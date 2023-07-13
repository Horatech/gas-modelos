import { TipoDispositivo } from "../auxiliares";
import { IIntegracion } from "./integraciones";

export interface IImagenesCliente {
  icono?: string;
  logo?: string;
  [key: string]: string | undefined;
}

export interface ICreateCliente {
  nombre: string;
  admin?: boolean;
  imagenes?: IImagenesCliente;
  tiposDispositivo?: TipoDispositivo[];
  integraciones?: IIntegracion[];
}

export interface IUpdateCliente {
  activo?: boolean;
  nombre?: string;
  admin?: boolean;
  imagenes?: IImagenesCliente;
  tiposDispositivo?: TipoDispositivo[];
  integraciones?: IIntegracion[];
}
