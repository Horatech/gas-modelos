import { ICentroOperativo, ICuenca, IUnidadNegocio } from "../gas";

export type Rol = "Administrador" | "Usuario" | "Croma";
export type Nivel = "Global" | "Unidad de Negocio" | "Centro Operativo";

export interface IPermiso {
  nivel: Nivel;
  rol: Rol;
  idsUnidadNegocios: string[];
  idsCentroOperativos?: string[];
  idsCuencas?: string[];
  // Populate
  unidadNegocios?: IUnidadNegocio[];
  centroOperativos?: ICentroOperativo[];
  cuencas?: ICuenca[];
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
