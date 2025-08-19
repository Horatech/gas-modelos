import { ICuenca, ILocalidad } from "../../entidades";
import { IAgrupacion } from "../../gas/agrupacion";
import { ICentroOperativo } from "../../gas/centroOperativo";
import { IUnidadNegocio } from "../../gas/unidadNegocio";

export type Rol =
  | "Administrador"
  | "Usuario"
  | "Croma"
  | "Visualizar"
  | "Laboratorista";
export type Nivel =
  | "Global"
  | "Unidad de Negocio"
  | "Centro Operativo"
  | "Localidad"
  | "Agrupación";
export type Division =
  | "Correctoras"
  | "Presión"
  | "Residencial"
  | "SCADA Unifilares"
  | "SCADA Mediciones";

export interface IPermiso {
  nivel?: Nivel;
  division?: Division;
  rol?: Rol;
  idsUnidadNegocios?: string[];
  idsCentroOperativos?: string[];
  idsLocalidades?: string[];
  idsCuencas?: string[];
  idsAgrupaciones?: string[];
  usaLlm?: boolean;
  // Populate
  unidadNegocios?: IUnidadNegocio[];
  centroOperativos?: ICentroOperativo[];
  localidades?: ILocalidad[];
  cuencas?: ICuenca[];
  agrupaciones?: IAgrupacion[];
}
