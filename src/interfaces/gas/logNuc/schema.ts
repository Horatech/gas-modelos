import { ITipoDispositivo } from '../../tenant';
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

export interface ILogNuc {
  _id: string;
  deveui: string;
  // El tipo de Mensaje que tiene adentro
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
