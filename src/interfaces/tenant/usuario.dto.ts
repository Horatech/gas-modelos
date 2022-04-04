export type Rol = "Administrador" | "Usuario";

export interface IPermisosGlobal {
  roles: Rol[];
}

export interface IPermisosUnidadNegocio {
  idUnidadNegocio: string;
  roles: Rol[];
}

export interface IPermisosGrupo {
  idGrupo: string;
  roles: Rol[];
}

export interface IPermiso {
  global?: IPermisosGlobal;
  unidadNegocio?: IPermisosUnidadNegocio[];
  grupo?: IPermisosGrupo[];
}

export interface IDatosPersonales {
  nombre?: string;
  email?: string;
}

export interface ICreateUsuario {
  idCliente?: string;
  username: string;
  clave?: string;
  hash?: string;
  datosPersonales?: IDatosPersonales;
  permisos: IPermiso;
}

export interface IUpdateUsuario {
  idCliente?: string;
  username?: string;
  clave?: string;
  hash?: string;
  activo?: boolean;
  datosPersonales?: IDatosPersonales;
  permisos?: IPermiso;
}
