import { ICorrectora } from "./correctora";
import { ICromatografia } from "./cromatografia.model";
import { ICuenca } from "./cuenca.model";
import { IUnidadNegocio } from "./unidadNegocio.model";

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
