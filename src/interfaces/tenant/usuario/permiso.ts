import { ICentroOperativo, ICuenca, IUnidadNegocio } from "../../gas";

export type Rol = "Administrador" | "Usuario" | "Croma" | "Visualizar";
export type Nivel = "Global" | "Unidad de Negocio" | "Centro Operativo";
export type Division = "Correctoras" | "Presión";

export interface IPermiso {
  nivel?: Nivel;
  division?: Division;
  rol?: Rol;
  idsUnidadNegocios?: string[];
  idsCentroOperativos?: string[];
  idsCuencas?: string[];
  // Populate
  unidadNegocios?: IUnidadNegocio[];
  centroOperativos?: ICentroOperativo[];
  cuencas?: ICuenca[];
}
