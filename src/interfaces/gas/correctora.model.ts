import { ICoordenadas } from "../auxiliares";
import { IAlerta } from "./alerta.model";
import { IRegistro } from "./registro.model";

export interface ICorrectora {
  _id: string;
  //
  firmware: string;
  numeroSerie: number;
  deveui: string;
  deviceName?: string;
  modelo: string;
  fechaCreacion: string;
  //
  ultimoRegistro?: IRegistro;
  ultimaAlerta?: IAlerta;
  idCromatorgrafiaAplicada?: string;
  //
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  nombre?: string;
  descripcion?: string;
  //
  idCliente: string;
  idUnidadNegocio?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  // Populate
  unidadNegocio?: any;
  cuenca?: any;
  grupos?: any[];
}
