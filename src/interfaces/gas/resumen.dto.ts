import { ICliente } from "../tenant";
import { ICentroOperativo } from "./centroOperativo";
import { ICuenca } from "./cuenca";
import { IMedidorResidencial } from "./medidorResidencial";
import { IPuntoMedicion } from "./punto-medicion";
import { IUnidadNegocio } from "./unidadNegocio";

// Resumen
export interface IResumenUnidadNegocio {
  unidadNegocio?: IUnidadNegocio;
  centroOperativos?: {
    cantReportesOkPunto?: number;
    cantReportesOkMedidor?: number;
    porcentajeReportePuntos?: number;
    porcentajeReporteMedidores?: number;
    centroOperativo?: ICentroOperativo;
    puntos?: IPuntoMedicion[];
    medidores?: IMedidorResidencial[];
  }[];
  cuencas?: {
    cantReportesOkPunto?: number;
    cantReportesOkMedidor?: number;
    porcentajeReportePuntos?: number;
    porcentajeReporteMedidores?: number;
    cuenca?: ICuenca;
    puntos?: IPuntoMedicion[];
    medidores?: IMedidorResidencial[];
  }[];
  cantidadCuencas?: number;
  cantidadCentroOperativos?: number;
  cantidadPuntos?: number;
  cantidadPuntosEnMantenimiento?: number;
  cantidadPuntosResolver?: number;
  cantidadPuntosSinDispositivo?: number;
  cantidadMedidores?: number;
  cantReportesOkPunto?: number;
  cantReportesOkMedidor?: number;
  porcentajeReportePuntos?: number;
  porcentajeReporteMedidores?: number;
}

export interface IResumenCliente {
  cliente: ICliente;
  cantidadDispositivos: number;
}
