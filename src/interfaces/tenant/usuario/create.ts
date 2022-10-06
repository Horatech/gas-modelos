import { IPermiso } from "./permiso";

export interface IDatosPersonales {
  nombre?: string;
  email?: string;
  [key: string]: any;
}

export interface ICreateUsuario {
  idCliente?: string;
  username: string;
  clave?: string;
  hash?: string;
  datosPersonales?: IDatosPersonales;
  permisos: IPermiso[];
}
