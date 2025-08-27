import { IUsuario } from "../tenant";
import { IAgrupacion } from "../gas/agrupacion";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ILocalidad } from "./localidad";
import { IGrupo } from "./grupo";

export type TipoAlerta =
  | "Unidades Presión - Fuera de límite"
  | "Unidades Presión - Error en reporte de alarma"
  | "Unidades Presión - Sensor desconectado"
  | "SCADA - Fuera de límite"
  | "SCADA - Cambio de límite"
  | "SCADA - Equipos fuera de línea"
  | "NSP - Equipos fuera de línea"
  | "NUC - Equipos fuera de línea"
  | "VERIBOX - Equipos fuera de línea"
  | "NUC - Batería baja"
  | "VERIBOX - Batería baja"
  | "NSP - Batería baja"
  | "SCADA - Error de comunicación con servidor";

export type TipoEnvio =
  | "SMS"
  | "WhatsApp"
  | "Llamada"
  | "Notificacion Push"
  | "Email";

export type Agrupacion =
  | "Global"
  | "Unidad de Negocio"
  | "Centro Operativo"
  | "Grupo"
  | "Agrupacion"
  | "Localidad";

export interface IConfigEnvioSms {
  // Para Equipos fuera de línea
  porcentaje?: number;
}

export interface IEnvioSms {
  _id?: string;
  idCliente?: string;

  agrupacion?: Agrupacion;
  tipoEnvio?: TipoEnvio;

  // Condiciones de envio
  tiposAlerta?: TipoAlerta[];
  config?: IConfigEnvioSms;

  // Mensaje
  mensaje?: string;

  // Fechas
  fechaCreacion?: Date;
  fechaEnvio?: Date | null;

  // Referencias

  idUnidadNegocio?: string | null;
  idCentroOperativo?: string | null;
  idGrupo?: string | null;
  idAgrupacion?: string | null;
  idLocalidad?: string | null;

  idsUsuarios?: string[];

  // Virtual
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  grupo?: IGrupo;
  agrupacion2?: IAgrupacion;
  localidad?: ILocalidad;
  usuarios?: IUsuario[];
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "unidadNegocio"
  | "centroOperativo"
  | "grupo"
  | "agrupacion2"
  | "localidad"
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
  | "localidad"
  | "usuarios";
export interface IUpdateEnvioSms
  extends Omit<Partial<IEnvioSms>, OmitirUpdate> {}
