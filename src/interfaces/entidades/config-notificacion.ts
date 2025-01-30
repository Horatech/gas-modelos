import { ICliente } from '../tenant';
import { TipoAlerta, TipoEnvio } from './envio-sms';
import { IPuntoMedicion } from './punto-medicion';

export interface IConfigNotificacion {
  _id?: string;
  //
  fechaCreacion?: string;
  tipoEnvio?: TipoEnvio;
  tipoAlerta?: TipoAlerta;
  idsUsuarios?: string[];
  idPuntoMedicion?: string;
  //
  idCliente?: string;
  // Populate
  cliente?: ICliente;
  puntoMedicion?: IPuntoMedicion;
}

////// CREATE/UPDATE
type Omitir = '_id' | 'cliente' | 'puntoMedicion';
export interface ICreateConfigNotificacion
  extends Omit<Partial<IConfigNotificacion>, Omitir> {}

export interface IUpdateConfigNotificacion
  extends Omit<Partial<IConfigNotificacion>, Omitir> {}
