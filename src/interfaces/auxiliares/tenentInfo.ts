import { ICentroOperativo } from "../gas/centroOperativo";
import { ICuenca } from "../gas/cuenca";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ICliente } from "../tenant";

export type ITenantInfo =
  //ITenantInfoAgro |
  ITenantInfoGas;

// export interface ITenantInfoAgro {
//   idCliente?: string;
//   idEstablecimiento?: string;
//   //
//   cliente?: ICliente;
//   establecimiento?: IEstablecimiento;
// }

export interface ITenantInfoGas {
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idCuenca?: string;
  // Virtual
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  cuenca?: ICuenca;
}
