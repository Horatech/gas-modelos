import { ICoordenadas } from "../../auxiliares";
import { IDispositivo } from "../../tenant";
import { ICentroOperativo } from "../centroOperativo";
import { ICuenca } from "../cuenca";
import { IGrupo } from "../grupo";
import { IReporteSml } from "../reporteSml";
import { IUnidadNegocio } from "../unidadNegocio";

export interface IMedidorResidencialAgua {
  _id: string;
  //
  deviceMeterNumber?: number;
  deveui: string;
  deviceName?: string;
  fechaCreacion: string;
  //
  ultimoReporte?: IReporteSml;
  //
  consumoInicial?: number;
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  nombre?: string;
  descripcion?: string;
  corregido?: boolean;
  //
  idCliente: string;
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
