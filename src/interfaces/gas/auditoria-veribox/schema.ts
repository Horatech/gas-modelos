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

/////////////////////////////////////////
// CREATE
type OmitirCreate = '_id';
export interface ICreateAuditoriaVeribox
  extends Omit<Partial<IAuditoriaVeribox>, OmitirCreate> {}
// UPDATE
type OmitirUpdate = '_id' | 'fechaCreacion';
export interface IUpdateAuditoriaVeribox
  extends Omit<Partial<IAuditoriaVeribox>, OmitirUpdate> {}
/////////////////////////////////////////
