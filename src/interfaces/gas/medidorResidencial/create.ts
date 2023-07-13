import { ICoordenadas } from "../../auxiliares";
import { IReporteSml } from "../reporteSml";

export interface ICreateMedidorResidencial {
  deviceMeterNumber?: number;
  deveui: string;
  deviceName?: string;
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
}
