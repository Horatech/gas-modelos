import { IUsuario } from "../../tenant";
import { IAgrupacion } from "../agrupacion";
import { ICentroOperativo } from "../centroOperativo";
import { IGrupo } from "../grupo";
import { IUnidadNegocio } from "../unidadNegocio";

export type TipoAlerta = "Unidades Presión - Fuera de límite";

export type TipoEnvio = "SMS" | "WhatsApp" | "Llamada" | "Notificacion Push";

export type Agrupacion =
  | "Global"
  | "Unidad de Negocio"
  | "Centro Operativo"
  | "Grupo"
  | "Agrupacion";

export interface IEnvioSms {
  _id?: string;
  idCliente?: string;
  tiposAlerta?: TipoAlerta[];
  agrupacion?: Agrupacion;
  tipoEnvio?: TipoEnvio;

  idUnidadNegocio?: string | null;
  idCentroOperativo?: string | null;
  idGrupo?: string | null;
  idAgrupacion?: string | null;

  idsUsuarios?: string[];

  // Virtual
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  grupo?: IGrupo;
  agrupacion2?: IAgrupacion;
  usuarios?: IUsuario[];
}
