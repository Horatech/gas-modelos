import { IDeviceInfo } from "./deviceInfo";
import { ITenantInfo } from "./tenentInfo";

export interface IReporteNUC {
  timestamp?: string;
  corrected?: number;
  uncorrected?: number;
  presion?: number;
  temperatura?: number;
  bateria?: number;
  // Valores firmware nuevo
  correctedTotalizado?: number;
  uncorrectedTotalizado?: number;
  correctedParcializado?: number;
  uncorrectedParcializado?: number;
  caudalCorregido?: number;
  caudalNoCorregido?: number;
  // Esto no se si va
  // numeroSerieCorrectora: number;
  // //
  // correctora?: ICorrectora;
}

export interface IReporte {
  fecha?: string;
  // Tentant
  tenant?: ITenantInfo;
  // Datos del dispositivo
  device?: IDeviceInfo;
  // Ids de otras entidades que tienen asignado el dispositivo que generó el reporte
  idsAsignados?: string[];
  // Datos especificos del reporte de acuerdo al tipo de dispositivo
  reporte?: Record<string, any>;
}
