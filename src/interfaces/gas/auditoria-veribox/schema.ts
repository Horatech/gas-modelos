export interface IAuditoriaVeribox {
  _id?: string;
  serialNumber?: string;
  fechaCreacion?: string;
  fecha?: string;
  comando?: string;
  valorOriginal?: string | null;
  valorNuevo?: string | null;
  // Tenancy
  idCliente?: string;
}

type Omitir = '_id' | 'fechaCreacion';

export interface ICreateAuditoriaVeribox
  extends Omit<Partial<IAuditoriaVeribox>, Omitir> {}

export interface IUpdateAuditoriaVeribox
  extends Omit<Partial<IAuditoriaVeribox>, Omitir> {}
