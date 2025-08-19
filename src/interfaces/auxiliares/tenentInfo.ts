import { ICuenca, ILocalidad } from "../entidades";
import { ICentroOperativo } from "../gas/centroOperativo";
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
  idLocalidad?: string;
  idCuenca?: string;
  // Virtual
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
  cuenca?: ICuenca;
}
