import { IUnidadNegocio } from "../unidadNegocio";

export interface ICentroOperativo {
  _id: string;
  nombre: string;
  idCliente: string;
  idUnidadNegocio: string;
  // Populate
  unidadNegocio?: IUnidadNegocio;
}
