import { IElementos } from './cromatografia.dto';
import { ICuenca } from './cuenca.model';
import { IUnidadNegocio } from './unidadNegocio.model';

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
}
