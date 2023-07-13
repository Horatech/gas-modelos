import { IUnidadNegocio } from "../unidadNegocio";

export interface ICuenca {
  _id: string;
  nombre: string;
  idUnidadNegocio: string;
  idCliente: string;
  // Virtual
  unidadNegocio: IUnidadNegocio;
}
