import { IReporte } from "..";
import { IAlerta } from "../alerta";

export interface IUpdateUnidadPresion {
  modelo?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  //
  ultimoRegistro?: IReporte;
  ultimaAlerta?: IAlerta;
  //
  estadoActual?:
    | "Sin Asignar"
    | "En Mantenimiento"
    | "Resolver"
    | "Sin Reportar"
    | "Operativa"
    | "Alerta";

  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
}
