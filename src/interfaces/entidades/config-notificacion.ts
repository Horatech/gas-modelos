import { ICliente, IUsuario } from '../tenant';
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
  usuarios?: IUsuario[];
}

////// CREATE/UPDATE
type Omitir = '_id' | 'cliente' | 'puntoMedicion' | 'usuarios';
export interface ICreateConfigNotificacion
  extends Omit<Partial<IConfigNotificacion>, Omitir> {}

export interface IUpdateConfigNotificacion
  extends Omit<Partial<IConfigNotificacion>, Omitir> {}
