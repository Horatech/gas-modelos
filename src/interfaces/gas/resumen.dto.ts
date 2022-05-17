import { IUnidadNegocio } from "./unidadNegocio.model";
import { ICuenca } from "./cuenca.model";
import { ICorrectora } from "./correctora.model";
import { ICliente } from "../tenant";
import { IMedidorResidencial } from "./medidorResidencial.model";

// Resumen
export interface IResumenUnidadNegocio {
  unidadNegocio: IUnidadNegocio;
  cuencas: {
    cuenca: ICuenca;
    correctoras: ICorrectora[];
    medidores: IMedidorResidencial[];
  }[];
  cantidadCuencas: number;
  cantidadCorrectoras: number;
  cantidadMedidores: number;
}

export interface IResumenCliente {
  cliente: ICliente;
  cantidadDispositivos: number;
}
