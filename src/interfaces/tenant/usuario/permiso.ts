import { ICentroOperativo, ICuenca, IUnidadNegocio } from "../../gas";

export type Rol = "Administrador" | "Usuario" | "Croma" | "Visualizar";
export type Nivel = "Global" | "Unidad de Negocio" | "Centro Operativo";

export interface IPermiso {
  nivel: Nivel;
  rol: Rol;
  idsUnidadNegocios?: string[];
  idsCentroOperativos?: string[];
  idsCuencas?: string[];
  // Populate
  unidadNegocios?: IUnidadNegocio[];
  centroOperativos?: ICentroOperativo[];
  cuencas?: ICuenca[];
}
