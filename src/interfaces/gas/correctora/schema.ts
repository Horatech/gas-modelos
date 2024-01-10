import { IDispositivo } from '../../tenant';
import { IAlerta } from '../alerta';
import { ICentroOperativo } from '../centroOperativo';
import { ICromatografia } from '../cromatografia';
import { IRegistro } from '../registro';
import { IUnidadNegocio } from '../unidadNegocio';

export interface ICorrectora {
  _id?: string;
  //
  firmware?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  modelo?: string;
  fechaCreacion?: string;
  bateria?: number;
  //
  ultimoRegistro?: IRegistro;
  ultimaAlerta?: IAlerta;
  ultimaCromatografia?: ICromatografia;
  fechaUltimaCromatografia?: string;
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
