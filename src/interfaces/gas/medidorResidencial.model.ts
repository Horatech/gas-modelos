import { ICoordenadas } from "../auxiliares";
import { ICuenca } from "./cuenca.model";
import { IReporteSml } from "./reporteSml.model";
import { IUnidadNegocio } from "./unidadNegocio.model";

export interface IMedidorResidencial {
  _id: string;
  //
  deviceMeterNumber: number;
  deveui: string;
  deviceName?: string;
  fechaCreacion: string;
  //
  ultimoReporte?: IReporteSml;
  //
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  nombre?: string;
  descripcion?: string;
  //
  idCliente: string;
  idUnidadNegocio?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  // Populate
  unidadNegocio?: IUnidadNegocio;
  cuenca?: ICuenca;
  grupos?: any[];
}
