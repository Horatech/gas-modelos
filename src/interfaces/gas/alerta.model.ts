export interface IAlerta {
  _id: string;
  deveui: string;
  deviceName?: string;
  firmwareNuc: string;
  apiVersion: string;
  numeroAlerta?: number;
  timestamp?: string;
  //
  numeroSerieCorrectora?: number;
  idUnidadNegocio?: string;
  //
  idCliente: string;
  //
  fechaCreacion: string;
}
