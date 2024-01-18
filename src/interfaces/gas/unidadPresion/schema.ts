import { ICentroOperativo, IReporte, IUnidadNegocio } from '..';
import { IDispositivo } from '../../tenant';
import { IAlerta } from '../alerta';

export interface IUnidadPresion {
  _id?: string;
  fechaCreacion?: string;
  //
  modelo?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  telefono?: string;
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
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  dispositivo?: IDispositivo;
}
