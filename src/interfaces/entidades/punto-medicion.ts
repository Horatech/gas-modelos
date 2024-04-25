import { GeoJSON, ICoordenadas } from "../auxiliares";
import { Division, ICliente } from "../tenant";
import { IAgrupacion } from "../gas/agrupacion";
import { ICentroOperativo } from "../gas/centroOperativo";
import { ICuenca } from "../gas/cuenca";
import { IGrupo } from "../gas/grupo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ICorrectora, IEstado } from "./correctora";
import { IUnidadPresion } from "./unidadPresion";
import { ILocalidad } from "./localidad";

export interface IPuntoMedicion {
  _id?: string;
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
  // Virtuals
  correctora?: ICorrectora;
  unidadPresion?: IUnidadPresion;
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad2?: ILocalidad;
  grupos?: IGrupo[];
  agrupaciones?: IAgrupacion[];
  cuenca?: ICuenca;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "correctora"
  | "unidadPresion"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad2"
  | "grupos"
  | "agrupaciones"
  | "cuenca";
export interface ICreatePuntoMedicion
  extends Omit<Partial<IPuntoMedicion>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "correctora"
  | "unidadPresion"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad2"
  | "grupos"
  | "agrupaciones"
  | "cuenca";
export interface IUpdatePuntoMedicion
  extends Omit<Partial<IPuntoMedicion>, OmitirUpdate> {}
