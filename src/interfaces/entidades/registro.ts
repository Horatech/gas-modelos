import { ICliente } from "../tenant";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ICorrectora } from "./correctora";
import { IPuntoMedicion } from "./punto-medicion";
import { ILocalidad } from "./localidad";
import { IGrupo } from "./grupo";
import { ICuenca } from "./cuenca";

export interface IRegistro {
  _id?: string;
  timestamp?: string;
  corrected?: number;
  uncorrected?: number;
  presion?: number;
  temperatura?: number;
  contador?: number;
  bateria?: number;
  bateriaNUC?: number;
  // Valores firmware nuevo
  correctedTotalizado?: number;
  uncorrectedTotalizado?: number;
  correctedParcializado?: number;
  uncorrectedParcializado?: number;
  caudalPromedio?: number;
  caudalPico?: number;
  //
  numeroSerieCorrectora?: string | null;
  deveui?: string;
  deviceName?: string;
  modelo?: string;
  //
  idCorrectora?: string;
  idPuntoMedicion?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  //
  fechaCreacion?: string;

  // Virtuals
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
  cuenca?: ICuenca;
  correctora?: ICorrectora;
  puntoMedicion?: IPuntoMedicion;
  grupos?: IGrupo[];
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad"
  | "cuenca"
  | "correctora"
  | "puntoMedicion"
  | "grupos";
export interface ICreateRegistro
  extends Omit<Partial<IRegistro>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad"
  | "cuenca"
  | "correctora"
  | "puntoMedicion"
  | "grupos";
export interface IUpdateRegistro
  extends Omit<Partial<IRegistro>, OmitirUpdate> {}
