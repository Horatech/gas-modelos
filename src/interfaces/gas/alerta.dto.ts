export interface ICreateAlerta {
  deveui: string;
  firmwareNuc: string;
  apiVersion: string;
  numeroAlerta?: number;
  timestamp?: number;
  //
  numeroSerieCorrectora?: number;
  //
  idCliente: string;
}
