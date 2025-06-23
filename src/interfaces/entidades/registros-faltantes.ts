export interface IRegistroFaltante {
  _id?: string;
  timestamp?: string;
  deveui?: string;
}

////// CREATE
type OmitirCreate = "_id";
export interface ICreateRegistroFaltante
  extends Omit<Partial<IRegistroFaltante>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = "_id";
export interface IUpdateRegistroFaltante
  extends Omit<Partial<IRegistroFaltante>, OmitirUpdate> {}
