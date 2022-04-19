import { ICoordenadas } from "../auxiliares";
import { IReporteSml } from "./reporteSml.model";

export interface ICreateMedidorResidencial {
  deviceMeterNumber: number;
  deveui: string;
  deviceName?: string;
  //
  ultimoReporte?: IReporteSml;
  //
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  nombre?: string;
  descripcion?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCuenca?: string;
  idsGrupos?: string[];
}

export interface IUpdateMedidorResidencial {
  deviceMeterNumber?: number;
  deveui?: string;
  deviceName?: string;
  //
  ultimoReporte?: IReporteSml;
  //
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  nombre?: string;
  descripcion?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCuenca?: string;
  idsGrupos?: string[];
}
