export interface ICreateAlerta {
  deveui?: string;
  deviceName?: string;
  firmwareNuc?: string;
  apiVersion?: string;
  numeroAlerta?: number;
  timestamp?: number;
  mensaje?: string;
  estado?: "Cerrado" | "Activo";
  fechaCierre?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idPuntoMedicion?: string;
  idUnidadPresion?: string;
  idCorrectora?: string;
  numeroSerieCorrectora?: string | null;
  //
}
