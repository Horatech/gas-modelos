import { ICoordenadas } from '../../auxiliares';
import { IDispositivo } from '../../tenant';
import { IAlerta } from '../alerta';
import { ICentroOperativo } from '../centroOperativo';
import { ICromatografia } from '../cromatografia';
import { ICuenca } from '../cuenca';
import { IGrupo } from '../grupo';
import { IRegistro } from '../registro';
import { IUnidadNegocio } from '../unidadNegocio';

export interface ICorrectora {
  _id: string;
  //
  firmware: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  deviceName?: string;
  modelo: string;
  fechaCreacion: string;
  bateria?: number;
  //
  ultimoRegistro?: IRegistro;
  ultimaAlerta?: IAlerta;
  ultimaCromatografia?: ICromatografia;
  fechaUltimaCromatografia?: string;
  //
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  nombre?: string;
  descripcion?: string;
  codigoSimec?: string;
  estadoActual?: 'Operativa' | 'En Mantenimiento' | 'Resolver' | string;
  //
  idCliente: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  cuenca?: ICuenca;
  grupos?: IGrupo[];
  dispositivo?: IDispositivo;
}
