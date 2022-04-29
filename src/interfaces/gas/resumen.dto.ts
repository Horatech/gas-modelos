import { IUnidadNegocio } from "./unidadNegocio.model";
import { ICuenca } from "./cuenca.model";
import { ICorrectora } from "./correctora.model";
import { ICliente } from "../tenant";

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

export interface IResumenCliente {
  cliente: ICliente;
  cantidadDispositivos: number;
}
