import { Division } from "../../tenant";

export interface ICreateGrupo {
  nombre: string;
  idUnidadNegocio: string;
  idCliente?: string;
  division?: Division;
}
