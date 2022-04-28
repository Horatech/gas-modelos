import { ICorrectora } from "./correctora.model";
import { ICuenca } from "./cuenca.model";

// Resumen
export interface IResumenUnidadNegocio {
  unidadNegocio: IResumenUnidadNegocio;
  cuencas: {
    cuenca: ICuenca;
    correctoras: ICorrectora[];
  }[];
  cantidadCuencas: number;
  cantidadCorrectoras: number;
}
