import { ICliente } from "../tenant";
import { ICentroOperativo } from "./centroOperativo";
import { ICorrectora } from "./correctora";
import { ICuenca } from "./cuenca";
import { IMedidorResidencial } from "./medidorResidencial";
import { IUnidadNegocio } from "./unidadNegocio";

// Resumen
export interface IResumenUnidadNegocio {
  unidadNegocio?: IUnidadNegocio;
  centroOperativos?: {
    cantReportesOkCorrectora?: number;
    cantReportesOkMedidor?: number;
    porcentajeReporteCorrectoras?: number;
    porcentajeReporteMedidores?: number;
    centroOperativo?: ICentroOperativo;
    correctoras?: ICorrectora[];
    medidores?: IMedidorResidencial[];
  }[];
  cuencas?: {
    cantReportesOkCorrectora?: number;
    cantReportesOkMedidor?: number;
    porcentajeReporteCorrectoras?: number;
    porcentajeReporteMedidores?: number;
    cuenca?: ICuenca;
    correctoras?: ICorrectora[];
    medidores?: IMedidorResidencial[];
  }[];
  cantidadCuencas?: number;
  cantidadCentroOperativos?: number;
  cantidadCorrectoras?: number;
  cantidadCorrectorasEnMantenimiento?: number;
  cantidadCorrectorasResolver?: number;
  cantidadMedidores?: number;
  cantReportesOkCorrectora?: number;
  cantReportesOkMedidor?: number;
  porcentajeReporteCorrectoras?: number;
  porcentajeReporteMedidores?: number;
}

export interface IResumenCliente {
  cliente: ICliente;
  cantidadDispositivos: number;
}
