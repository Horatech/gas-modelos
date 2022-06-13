import { ICentroOperativo, IUnidadNegocio } from "../gas";

export type Rol = "Administrador" | "Usuario";

export interface IPermiso {
  rol: Rol;
  global?: boolean;
  idsUnidadNegocios?: string[];
  idsCentroOperativos?: string[];
  // Populate
  unidadNegocios?: IUnidadNegocio[];
  centroOperativos?: ICentroOperativo[];
}

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

export interface IUpdateUsuario {
  idCliente?: string;
  username?: string;
  clave?: string;
  hash?: string;
  activo?: boolean;
  datosPersonales?: IDatosPersonales;
  permisos?: IPermiso[];
}
