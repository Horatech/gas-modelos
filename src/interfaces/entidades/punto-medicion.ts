import { GeoJSON, ICoordenadas } from "../auxiliares";
import { Division, ICliente } from "../tenant";
import { IAgrupacion } from "../gas/agrupacion";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ICorrectora, IEstado } from "./correctora";
import { IUnidadPresion } from "./unidad-presion";
import { ILocalidad } from "./localidad";
import { IGrupo } from "./grupo";
import { IMedidorResidencial } from "./medidor-residencial";
import { IMedidorResidencialAgua } from "./medidor-residencial-agua";
import { IScada } from "./scada";
import { ICuenca } from "./cuenca";

export interface ILimitesNotificacion {
  sms?: number;
  whatsapp?: number;
  llamada?: number;
  email?: number;
  push?: number;
}

export interface IPuntoMedicion {
  _id?: string;
  //
  posicion?: number;
  // GPS
  geojson?: GeoJSON;
  ubicacion?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  // Detalles
  nombre?: string;
  descripcion?: string;
  codigoSimec?: string;
  // Correctora
  idCorrectora?: string | null;
  fechaAsignacionCorrectora?: string | null;
  // Unidad de Presion
  idUnidadPresion?: string | null;
  fechaAsignacionUnidadPresion?: string | null;
  // Medidor Residencial
  idMedidorResidencial?: string | null;
  fechaAsignacionMedidorResidencial?: string | null;
  // Medidor Residencial Agua
  idMedidorResidencialAgua?: string | null;
  fechaAsignacionMedidorResidencialAgua?: string | null;
  // SCADA
  idsScada?: string[] | null;
  fechaAsignacionScada?: string | null;
  // Calculado por el backend
  estado?: IEstado;
  // Tenancy
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idsGrupos?: string[];
  idsAgrupaciones?: string[];
  idCuenca?: string;
  division?: Division;
  limitesNotificacion?: ILimitesNotificacion;
  // Virtuals
  correctora?: ICorrectora;
  unidadPresion?: IUnidadPresion;
  medidorResidencial?: IMedidorResidencial;
  medidorResidencialAgua?: IMedidorResidencialAgua;
  scadas?: IScada[];
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad2?: ILocalidad;
  grupos?: IGrupo[];
  agrupaciones?: IAgrupacion[];
  cuenca?: ICuenca;
}

////// CREATE/UPDATE
type Omitir =
  | "_id"
  | "correctora"
  | "unidadPresion"
  | "medidorResidencial"
  | "medidorResidencialAgua"
  | "scadas"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad2"
  | "grupos"
  | "agrupaciones"
  | "cuenca";
export interface ICreatePuntoMedicion
  extends Omit<Partial<IPuntoMedicion>, Omitir> {}

export interface IUpdatePuntoMedicion
  extends Omit<Partial<IPuntoMedicion>, Omitir> {}
