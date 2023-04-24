import { IPermiso } from "../permiso";

export interface IPerfil {
  _id?: string;
  nombre?: string;
  idsPermisos?: string[];
  // Populate
  permisos?: IPermiso[];
}
