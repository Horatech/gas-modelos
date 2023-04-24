import { IDatosPersonales } from "./schema";

export interface ICreateUsuario {
  username: string;
  password: string;
  hash?: string;
  datosPersonales?: IDatosPersonales;
}
