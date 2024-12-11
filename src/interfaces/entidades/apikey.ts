import { ICliente } from '../tenant';

export interface IApikey {
  _id?: string;
  //
  identificacion?: string;
  key?: string;
  idCliente?: string;
  // Populate
  cliente?: ICliente;
}

type OmitirCreate = '_id' | 'cliente';

export interface ICreateApikey extends Omit<Partial<IApikey>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente';

export interface IUpdateApikey extends Omit<Partial<IApikey>, OmitirUpdate> {}
