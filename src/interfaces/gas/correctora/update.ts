import { ICoordenadas } from "../../auxiliares";
import { IAlerta } from "../alerta";
import { ICromatografia } from "../cromatografia";
import { IRegistro } from "../registro";

export interface IUpdateCorrectora {
  firmware?: string;
  numeroSerie?: number;
  deveui?: string | null;
  deviceName?: string;
  modelo?: string;
  bateria?: number;
  //
  ultimoRegistro?: IRegistro;
  ultimaAlerta?: IAlerta;
  ultimaCromatografia?: ICromatografia;
  fechaUltimaCromatografia?: string;
  //
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  nombre?: string;
  descripcion?: string;
  codigoSimec?: string;
  estadoActual?: "Operativa" | "En Mantenimiento" | "Resolver" | string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idCuenca?: string;
  idsGrupos?: string[];
}
