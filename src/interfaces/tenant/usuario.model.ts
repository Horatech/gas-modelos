import { ICliente } from "./cliente.model";
import { IDatosPersonales, IPermiso } from "./usuario.dto";

export interface IUsuario {
  _id: string;
  username: string;
  hash?: string;
  idCliente: string;
  activo: boolean;
  fechaCreacion: string;
  permisos: IPermiso[];
  datosPersonales?: IDatosPersonales;
  // Virtuals
  cliente?: ICliente;
}
