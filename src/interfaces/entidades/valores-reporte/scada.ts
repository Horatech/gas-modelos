import { TipoScada } from '../scada';

/**
 * @property limiteHH - Limite superior alto es null cuando no existe
 * @property limiteH - Limite superior es null cuando no existe
 * @property limiteLL - Limite inferior bajo es null cuando no existe
 * @property limiteL - Limite inferior es null cuando no existe
 */
export interface IReporteScada {
  tipo?: TipoScada;
  timestamp?: string;
  valorActual?: number;
  limiteHH?: number | null;
  limiteH?: number | null;
  limiteLL?: number | null;
  limiteL?: number | null;
}
