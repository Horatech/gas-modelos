import { ICoordenadas } from "../../auxiliares";
import { IDispositivo, IGrupo } from "../../entidades";
import { ICentroOperativo } from "../centroOperativo";
import { ICuenca } from "../cuenca";
import { IReporteSml } from "../reporteSml";
import { IUnidadNegocio } from "../unidadNegocio";

export interface IMedidorResidencial {
  _id?: string;
  //
  deviceMeterNumber?: number;
  deveui?: string;
  deviceName?: string;
  fechaCreacion?: string;
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
