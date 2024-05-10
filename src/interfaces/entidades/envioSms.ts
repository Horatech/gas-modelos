import { IUsuario } from "../tenant";
import { IAgrupacion } from "../gas/agrupacion";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IGrupo } from "../gas/grupo";
import { IUnidadNegocio } from "../gas/unidadNegocio";

export type TipoAlerta =
  | "Unidades Presión - Fuera de límite"
  | "Unidades Presión - Error en reporte de alarma";

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

////// CREATE
type OmitirCreate =
  | "_id"
  | "unidadNegocio"
  | "centroOperativo"
  | "grupo"
  | "agrupacion2"
  | "usuarios";
export interface ICreateEnvioSms
  extends Omit<Partial<IEnvioSms>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "unidadNegocio"
  | "centroOperativo"
  | "grupo"
  | "agrupacion2"
  | "usuarios";
export interface IUpdateEnvioSms
  extends Omit<Partial<IEnvioSms>, OmitirUpdate> {}
