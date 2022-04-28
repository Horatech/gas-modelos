import { IUnidadNegocio } from "./unidadNegocio.model";
import { ICuenca } from "./cuenca.model";
import { ICorrectora } from "./correctora.model";

// Resumen
export interface IResumenUnidadNegocio {
  unidadNegocio: IUnidadNegocio;
  cuencas: {
    cuenca: ICuenca;
    correctoras: ICorrectora[];
  }[];
  cantidadCuencas: number;
  cantidadCorrectoras: number;
}
