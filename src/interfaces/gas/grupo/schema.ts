import { Division } from "../../tenant";
import { IUnidadNegocio } from "../unidadNegocio";

export interface IGrupo {
  _id: string;
  nombre: string;
  idCliente: string;
  idUnidadNegocio: string;
  division?: Division;
  // Populate
  unidadNegocio?: IUnidadNegocio;
}
