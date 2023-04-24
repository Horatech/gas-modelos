import { INivel, IRol } from "../rol/schema";

export interface IRolUsuario {
  _id?: string;
  email?: string;
  nivel?: INivel;
  idCliente?: string;
  idEstablecimiento?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idRol?: string;
}
