import { IUnidadNegocio } from "./unidadNegocio.model";
import { ICuenca } from "./cuenca.model";
import { ICorrectora } from "./correctora.model";
import { ICliente } from "../tenant";
import { IMedidorResidencial } from "./medidorResidencial.model";
import { ICentroOperativo } from "./centroOperativo.model";

// Resumen
export interface IResumenUnidadNegocio {
  unidadNegocio: IUnidadNegocio;
  centroOperativos: {
    cantReportesOkCorrectora: number;
    cantReportesOkMedidor: number;
    porcentajeReporteCorrectoras: number;
    porcentajeReporteMedidores: number;
    centroOperativo: ICentroOperativo;
    correctoras: ICorrectora[];
    medidores: IMedidorResidencial[];
  }[];
  cuencas: {
    cantReportesOkCorrectora: number;
    cantReportesOkMedidor: number;
    porcentajeReporteCorrectoras: number;
    porcentajeReporteMedidores: number;
    cuenca: ICuenca;
    correctoras: ICorrectora[];
    medidores: IMedidorResidencial[];
  }[];
  cantidadCuencas: number;
  cantidadCentroOperativos: number;
  cantidadCorrectoras: number;
  cantidadMedidores: number;
  cantReportesOkCorrectora: number;
  cantReportesOkMedidor: number;
  porcentajeReporteCorrectoras: number;
  porcentajeReporteMedidores: number;
}

export interface IResumenCliente {
  cliente: ICliente;
  cantidadDispositivos: number;
}
