import { IUsuario } from "../../tenant";
import { ICentroOperativo } from "../centroOperativo";
import { IGrupo } from "../grupo";
import { IUnidadNegocio } from "../unidadNegocio";

export type TipoAlerta = "Unidades Presión - Fuera de límite ";

export type Agrupacion =
  | "Global"
  | "Unidad de Negocio"
  | "Centro Operativo"
  | "Grupo";

export interface IEnvioSms {
  _id?: string;
  idCliente?: string;
  tiposAlerta?: TipoAlerta[];
  agrupacion?: Agrupacion;

  idUnidadNegocio?: string | null;
  idCentroOperativo?: string | null;
  idGrupo?: string | null;

  idsUsuarios?: string[];

  // Virtual
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  grupo?: IGrupo;
  usuarios?: IUsuario[];
}
