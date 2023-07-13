import { IUsuario } from "../../tenant";
import { ICuenca } from "../cuenca";
import { IUnidadNegocio } from "../unidadNegocio";
import { IElementos } from "./elementos";

export interface ICromatografia {
  _id: string;
  idUsuario?: string;
  idCuenca: string;
  idCliente: string;
  idUnidadNegocio: string;
  fechaAplicacion: string;
  fechaVencimiento: string;
  elementos: IElementos;
  //
  fechaCreacion: string;
  // Virtual
  cuenca?: ICuenca;
  unidadNegocio?: IUnidadNegocio;
  usuario?: IUsuario;
}
