import { ICromatografia, ICuenca, IUnidadNegocio } from "..";
import { ICorrectora } from "../../entidades";

export interface IAplicacionCromatografia {
  _id?: string;
  aplicada?: boolean;
  idCromatografia?: string;
  idCorrectora?: string;
  numeroSerieCorrectora?: string | null;
  fechaCreacion?: string;
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
