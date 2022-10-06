import { IDatosPersonales } from "./create";
import { INotificaciones } from "./notificacion";
import { IPermiso } from "./permiso";

export interface IUpdateUsuario {
  idCliente?: string;
  username?: string;
  clave?: string;
  hash?: string;
  activo?: boolean;
  datosPersonales?: IDatosPersonales;
  permisos?: IPermiso[];
  notificaciones?: INotificaciones[];
}
