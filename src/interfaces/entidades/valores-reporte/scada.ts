import { TipoScada } from '../scada';

export interface IReporteScada {
  tipo?: TipoScada;
  timestamp?: string;
  valorActual?: number;
  limiteHH?: number;
  limiteH?: number;
  limiteLL?: number;
  limiteL?: number;
}
