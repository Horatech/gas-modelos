import { INivel } from "../rol/schema";

export interface IUpdateRolUsuario {
  email?: string;
  nivel?: INivel;
  idCliente?: string;
  idEstablecimiento?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idRol?: string;
}
