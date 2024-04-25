import { ILocalidad } from "../../entidades";
import { IAgrupacion } from "../../gas/agrupacion";
import { ICentroOperativo } from "../../gas/centroOperativo";
import { ICuenca } from "../../gas/cuenca";
import { IUnidadNegocio } from "../../gas/unidadNegocio";

export type Rol = "Administrador" | "Usuario" | "Croma" | "Visualizar";
export type Nivel =
  | "Global"
  | "Unidad de Negocio"
  | "Centro Operativo"
  | "Localidad"
  | "Agrupación";
export type Division = "Correctoras" | "Presión";

export interface IPermiso {
  nivel?: Nivel;
  division?: Division;
  rol?: Rol;
  idsUnidadNegocios?: string[];
  idsCentroOperativos?: string[];
  idsLocalidades?: string[];
  idsCuencas?: string[];
  idsAgrupaciones?: string[];
  // Populate
  unidadNegocios?: IUnidadNegocio[];
  centroOperativos?: ICentroOperativo[];
  localidades?: ILocalidad[];
  cuencas?: ICuenca[];
  agrupaciones?: IAgrupacion[];
}
