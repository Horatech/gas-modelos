import { IPerfil } from "../perfil";

// Agro

export type INivelPermisoAgro = "Admin" | "Cliente" | "Establecimiento";
export const NIVELES_PERMISO_AGRO: INivelPermisoAgro[] = [
  "Admin",
  "Cliente",
  "Establecimiento",
];

// Gas

export type INivelPermisoGas =
  | "Admin"
  | "Cliente"
  | "Unidad de Negocio"
  | "Centro Operativo";
export const NIVELES_PERMISO: INivelPermisoGas[] = [
  "Admin",
  "Cliente",
  "Unidad de Negocio",
  "Centro Operativo",
];

//

export type INivel = INivelPermisoAgro | INivelPermisoGas;

export interface IRol {
  _id?: string;
  nombre?: string;
  variante?: string;
  nivel?: INivel;
  idsPerfiles?: string[];
  // Populate
  perfiles?: IPerfil[];
}
