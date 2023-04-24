import { IDatosPersonales } from "./schema";

export interface IUpdateUsuario {
  activo?: boolean;
  username?: string;
  password?: string;
  hash?: string;
  datosPersonales?: IDatosPersonales;
}
