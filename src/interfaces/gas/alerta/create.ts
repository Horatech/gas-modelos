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
  //
  idCliente: string;
}
