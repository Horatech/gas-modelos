import { ICentroOperativo, IReporte, IUnidadNegocio } from "..";
import { IDispositivo } from "../../tenant";
import { IAlerta } from "../alerta";

export interface IUnidadPresion {
  _id?: string;
  fechaCreacion?: string;
  //
  modelo?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  //
  ultimoRegistro?: IReporte;
  ultimaAlerta?: IAlerta;
  //
  estadoActual?: "Operativa" | "En Mantenimiento" | "Resolver" | string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  dispositivo?: IDispositivo;
}
