import { IDispositivo, IScada } from '../entidades';
import { TipoDispositivo } from './tipoDispositivo';

export interface IDeviceInfo {
  name?: string;
  deveui?: string;
  tag?: string; // Solo SCADA
  tipo?: TipoDispositivo;
  // Virtual
  dispositivo?: IDispositivo;
  scada?: IScada;
}
