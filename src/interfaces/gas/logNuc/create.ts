import {
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
} from './extras';

export interface ICreateLogNuc {
  deveui: string;
  tipo: TipoMensaje;
  body:
    | ISetAlerta
    | ISetAlertaV2
    | ISetConfiguracion
    | ISetConfiguracionV2
    | ISetCorrectora
    | ISetCorrectoraV3
    | ISetCromatografia
    | ISetRegistro
    | ISetRegistroV3
    | ISetReporte
    | ISetReporteV3;
  fecha: string;
}
