import { IImagenesCliente } from "./cliente.dto";

export interface ICliente {
  _id: string;
  fechaCreacion: string;
  activo: boolean;
  nombre: string;
  admin: boolean;
  imagenes: IImagenesCliente;
}
