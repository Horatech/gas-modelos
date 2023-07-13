import { IElementos } from "./elementos";

export interface IUpdateCromatografia {
  idCuenca?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  fechaAplicacion?: string;
  fechaVencimiento?: string;
  elementos?: IElementos;
}
