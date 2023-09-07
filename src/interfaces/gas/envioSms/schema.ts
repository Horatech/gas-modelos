import { IUsuario } from "../../tenant";
import { ICentroOperativo } from "../centroOperativo";
import { IGrupo } from "../grupo";
import { IUnidadNegocio } from "../unidadNegocio";

export type TipoAlerta = "Unidades Presión - Fuera de límite ";

export type Agrupacion = "Unidad de Negocio" | "Centro Operativo" | "Grupo";

export interface IEnvioSms {
  _id?: string;
  idCliente?: string;
  tiposAlerta?: TipoAlerta[];
  agrupacion?: Agrupacion;

  idUnidadNegocio?: string | null;
  idCentroOperativo?: string | null;
  idsGrupos?: string[] | null;

  idsUsuarios?: string[];

  // Virtual
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  grupos?: IGrupo[];
  usuarios?: IUsuario[];
}
