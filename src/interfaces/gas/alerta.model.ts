export interface IAlerta {
  _id: string;
  deveui: string;
  deviceName?: string;
  firmwareNuc: string;
  apiVersion: string;
  numeroAlerta?: number;
  timestamp?: number;
  //
  numeroSerieCorrectora?: number;
  //
  idCliente: string;
  //
  fechaCreacion: string;
}
