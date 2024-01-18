import { IAlerta } from '../alerta';
import { IReporte } from '../reporte';

export interface ICreateUnidadPresion {
  modelo?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  telefono?: string;
  //
  ultimoRegistro?: IReporte;
  ultimaAlerta?: IAlerta;
  //
  estadoActual?: 'Operativa' | 'En Mantenimiento' | 'Resolver' | string;
  //
  idCliente: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
}
