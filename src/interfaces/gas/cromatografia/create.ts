import { IElementos } from "./elementos";

export interface ICreateCromatografia {
  idCuenca: string;
  idUsuario?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  fechaAplicacion: string;
  fechaVencimiento: string;
  elementos: IElementos;
}
