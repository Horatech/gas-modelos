import { ICoordenadas } from "../auxiliares";
import { IAlerta } from "./alerta.model";
import { IRegistro } from "./registro.model";

export interface ICreateCorrectora {
  firmware?: string;
  numeroSerie: number;
  deveui: string;
  modelo?: string;
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
  idCliente?: string;
  idUnidadNegocio?: string;
  idCuenca?: string;
  idsGrupos?: string[];
}

export interface IUpdateCorrectora {
  firmware?: string;
  numeroSerie?: number;
  deveui?: string;
  modelo?: string;
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
  idCliente?: string;
  idUnidadNegocio?: string;
  idCuenca?: string;
  idsGrupos?: string[];
}
