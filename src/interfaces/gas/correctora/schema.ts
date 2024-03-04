import { IDispositivo } from "../../tenant";
import { IAlerta } from "../alerta";
import { ICentroOperativo } from "../centroOperativo";
import { ICromatografia } from "../cromatografia";
import { ModeloCorrectora } from "../logNuc";
import { IRegistro } from "../registro";
import { IUnidadNegocio } from "../unidadNegocio";

export interface ICorrectora {
  _id?: string;
  //
  firmware?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  modelo?: ModeloCorrectora;
  fechaCreacion?: string;
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
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  dispositivo?: IDispositivo;
}
