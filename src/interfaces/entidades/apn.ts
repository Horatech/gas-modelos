export interface IApn {
  _id?: string;
  apn?: string;
  usuario?: string;
  password?: string;
}

// CREATE
type OmitirCreate = "_id";
export interface ICreateApn extends Omit<Partial<IApn>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id";
export interface IUpdateApn extends Omit<Partial<IApn>, OmitirUpdate> {}
