import { ICromatografia, ICuenca, IUnidadNegocio } from "..";
import { ICorrectora } from "../correctora";

export interface IAplicacionCromatografia {
  _id: string;
  aplicada: boolean;
  idCromatografia: string;
  numeroSerieCorrectora: number;
  fechaCreacion: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCuenca?: string;
  // Virtual
  correctora?: ICorrectora;
  cromatografia?: ICromatografia;
  unidadNegocio?: IUnidadNegocio;
  cuenca?: ICuenca;
}
