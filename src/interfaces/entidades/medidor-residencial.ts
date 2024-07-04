import { ICoordenadas } from "../auxiliares";
import { ICentroOperativo, ICuenca, IUnidadNegocio } from "../gas";
import { IEstado } from "./correctora";
import { IDispositivo } from "./dispositivo";
import { IGrupo } from "./grupo";
import { IReporte } from "./reporte";

export interface IMedidorResidencial {
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
  localidad?: string;
  nombre?: string;
  descripcion?: string;
  corregido?: boolean;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  cuenca?: ICuenca;
  grupos?: IGrupo[];
  dispositivo?: IDispositivo;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "unidadNegocio"
  | "centroOperativo"
  | "cuenca"
  | "grupos"
  | "dispositivo";
export interface ICreateMedidorResidencial
  extends Omit<Partial<IMedidorResidencial>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "unidadNegocio"
  | "centroOperativo"
  | "cuenca"
  | "grupos"
  | "dispositivo";
export interface IUpdateMedidorResidencial
  extends Omit<Partial<IMedidorResidencial>, OmitirUpdate> {}
