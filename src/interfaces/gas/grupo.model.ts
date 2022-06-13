import { IUnidadNegocio } from "./unidadNegocio.model";

export interface IGrupo {
  _id: string;
  nombre: string;
  idCliente: string;
  idUnidadNegocio: string;
  // Populate
  unidadNegocio?: IUnidadNegocio;
}
