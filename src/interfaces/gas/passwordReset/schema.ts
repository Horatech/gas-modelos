import { IUsuario } from "../../tenant";

export interface IPasswordReset {
  _id?: string;
  idUsuario?: string;
  token?: string;
  vencimiento?: number;
  utilizado?: boolean;

  // virtuals
  usuario?: IUsuario;
}

type OmitirCreate = "_id" | "usuario";
export interface ICreatePasswordReset
  extends Omit<Partial<IPasswordReset>, OmitirCreate> {}

type OmitirUpdate = "_id" | "usuario";

export interface IUpdatePasswordReset
  extends Omit<Partial<IPasswordReset>, OmitirUpdate> {}
