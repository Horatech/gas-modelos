import { ICentroOperativo } from "../../gas/centroOperativo";
import { IUnidadNegocio } from "../../gas/unidadNegocio";
import { Nivel } from "./permiso";

export enum ICodigoNotificacion {
  "Correctora sin Reportar" = 0,
  "Error de Comunicación con la Correctora" = 1,
  "Cromatografía Próxima a Vencer" = 2,
}

export interface INotificaciones {
  nivel: Nivel;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  habilitados?: ICodigoNotificacion[];

  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
}
