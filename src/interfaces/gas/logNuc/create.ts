import {
  IGetConfiguracionV2,
  IGetCromatografia,
  IGetRegistro,
  ISetAlerta,
  ISetAlertaV2,
  ISetConfiguracion,
  ISetConfiguracionV2,
  ISetCorrectora,
  ISetCorrectoraV3,
  ISetCromatografia,
  ISetRegistro,
  ISetRegistroV3,
  ISetReporte,
  ISetReporteV3,
  TipoMensaje,
} from "./extras";

export interface ICreateLogNuc {
  deveui?: string;
  tipo?: TipoMensaje;
  body?: object;
  fecha?: string;
  tiempoRespuesta?: number;
  codigoRespuesta?: number;
  respuesta?: object;
}
