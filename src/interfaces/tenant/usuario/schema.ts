import { ICliente } from "../cliente.model";
import { IDatosPersonales } from "./create";
import { INotificaciones } from "./notificacion";
import { IPermiso } from "./permiso";

export interface IUsuario {
  _id: string;
  username: string;
  hash?: string;
  idCliente: string;
  activo: boolean;
  fechaCreacion: string;
  permisos: IPermiso[];
  datosPersonales?: IDatosPersonales;
  notificaciones?: INotificaciones[];
  // Virtuals
  cliente?: ICliente;
}
