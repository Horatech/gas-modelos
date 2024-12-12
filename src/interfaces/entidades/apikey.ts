import { ICliente } from '../tenant';

export interface IApikey {
  _id?: string;
  //
  fechaCreacion?: string;
  identificacion?: string;
  key?: string;
  idCliente?: string;
  // Populate
  cliente?: ICliente;
}

type Omitir = '_id' | 'fechaCreacion' | 'cliente';

export interface ICreateApikey extends Omit<Partial<IApikey>, Omitir> {}

export interface IUpdateApikey extends Omit<Partial<IApikey>, Omitir> {}
