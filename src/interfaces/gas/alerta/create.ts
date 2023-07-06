export interface ICreateAlerta {
  deveui: string;
  deviceName?: string;
  firmwareNuc: string;
  apiVersion: string;
  numeroAlerta?: number;
  timestamp?: number;
  mensaje?: string;
  //
  numeroSerieCorrectora?: number;
  idUnidadNegocio?: string;
  idCorrectora?: string;
  idPuntoMedicion?: string;
  //
  idCliente: string;
}
