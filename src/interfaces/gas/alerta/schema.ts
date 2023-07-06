export interface IAlerta {
  _id: string;
  deveui: string;
  deviceName?: string;
  firmwareNuc: string;
  apiVersion: string;
  numeroAlerta?: number;
  timestamp?: string;
  mensaje?: string;
  //
  numeroSerieCorrectora?: number;
  idUnidadNegocio?: string;
  idCorrectora?: string;
  idPuntoMedicion?: string;
  //
  idCliente: string;
  //
  fechaCreacion: string;
}
