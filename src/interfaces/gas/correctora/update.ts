import { ICoordenadas } from "../../auxiliares";
import { IAlerta } from "../alerta";
import { ICromatografia } from "../cromatografia";
import { IRegistro } from "../registro";

export interface IUpdateCorrectora {
  firmware?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  modelo?: string;
  bateria?: number;
  //
  ultimoRegistro?: IRegistro;
  ultimaAlerta?: IAlerta;
  ultimaCromatografia?: ICromatografia;
  fechaUltimaCromatografia?: string;
  //
  estadoActual?: "Operativa" | "En Mantenimiento" | "Resolver" | string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
}
