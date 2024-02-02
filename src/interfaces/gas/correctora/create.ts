import { ICoordenadas } from "../../auxiliares";
import { IAlerta } from "../alerta";
import { ICromatografia } from "../cromatografia";
import { IRegistro } from "../registro";

export interface ICreateCorrectora {
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
  estadoActual?:
    | "Sin Asignar"
    | "En Mantenimiento"
    | "Resolver"
    | "Sin Reportar"
    | "Operativa"
    | "Alerta";
  //
  idCliente: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
}
