import { ICentroOperativo, IUnidadNegocio } from "../../gas";

export enum ICodigoNotificacion {
  "Correctora sin Reportar" = 0,
  "Error de Comunicación con la Correctora" = 1,
  "Cromatografía Próxima a Vencer" = 2,
}

export interface INotificaciones {
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  habilitados?: ICodigoNotificacion[];

  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
}
