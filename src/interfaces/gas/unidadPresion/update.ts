import { IReporte } from '..';
import { IAlerta } from '../alerta';

export interface IUpdateUnidadPresion {
  modelo?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  //
  ultimoRegistro?: IReporte;
  ultimaAlerta?: IAlerta;
  //
  estadoActual?: 'Operativa' | 'En Mantenimiento' | 'Resolver' | string;
  // Calculado por el backend
  estado?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
}
