import { ICoordenadas } from "../auxiliares";
import { ICentroOperativo, IUnidadNegocio } from "../gas";
import { IEstado } from "./correctora";
import { ICuenca } from "./cuenca";
import { IDispositivo } from "./dispositivo";
import { IGrupo } from "./grupo";
import { ILocalidad } from "./localidad";
import { IReporte } from "./reporte";

export interface IMedidorResidencialAgua {
  _id?: string;
  //
  deviceMeterNumber?: number;
  deveui?: string;
  deviceName?: string;
  fechaCreacion?: string;
  //
  ultimoReporte?: IReporte;
  estadoActual?: IEstado;
  //
  consumoInicial?: number;
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  nombre?: string;
  descripcion?: string;
  corregido?: boolean;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
  cuenca?: ICuenca;
  grupos?: IGrupo[];
  dispositivo?: IDispositivo;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad"
  | "cuenca"
  | "grupos"
  | "dispositivo";
export interface ICreateMedidorResidencialAgua
  extends Omit<Partial<IMedidorResidencialAgua>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad"
  | "cuenca"
  | "grupos"
  | "dispositivo";
export interface IUpdateMedidorResidencialAgua
  extends Omit<Partial<IMedidorResidencialAgua>, OmitirUpdate> {}
