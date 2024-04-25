import { ICliente, IUsuario } from "../tenant";
import { IAgrupacion } from "../gas/agrupacion";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ICorrectora } from "./correctora";
import { IDispositivo } from "./dispositivo";
import { ILocalidad } from "./localidad";

export interface IMantenimiento {
  _id?: string;
  // Generado
  fechaCreacion?: string;
  // Input
  fecha?: string;
  descripcion?: string;
  tipo?: string;
  idAsignado?: string;
  // Tenancy
  idCliente?: string;
  idUsuario?: string;
  idUnidadDeNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idAgrupacion?: string;

  // Virtuals
  correctora?: ICorrectora;
  dispositivo?: IDispositivo;
  cliente?: ICliente;
  usuario?: IUsuario;
  unidadDeNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
  agrupacion?: IAgrupacion;
}

// CREATE
type OmitirCreate =
  | "_id"
  | "correctora"
  | "dispositivo"
  | "cliente"
  | "usuario"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "agrupacion"
  | "fechaCreacion";
export interface ICreateMantenimiento
  extends Omit<Partial<IMantenimiento>, OmitirCreate> {
  tipoAsignado?: "Correctora" | "Dispositivo";
}

// UPDATE
type OmitirUpdate =
  | "_id"
  | "fechaCreacion"
  | "correctora"
  | "dispositivo"
  | "cliente"
  | "usuario"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "agrupacion";
export interface IUpdateMantenimiento
  extends Omit<Partial<IMantenimiento>, OmitirUpdate> {
  tipoAsignado?: "Correctora" | "Dispositivo";
}
