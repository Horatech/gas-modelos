import { IAlerta } from "./alerta";
import { IRegistro } from "./registro.model";

export interface ICreateDispositivoNuc4G {
  idCliente: string;
  deveui: string;
  firmwareNuc: string;
  apiVersion: string;
  frecuenciaComunicacion: number;
  horaInicio: number;
  modoOperacion: string;
  redPreferida: string;
  //
  deviceName?: string;
}

export interface IUpdateDispositivoNuc4G {
  idCliente?: string;
  deveui?: string;
  firmwareNuc?: string;
  apiVersion?: string;
  frecuenciaComunicacion?: number;
  horaInicio?: number;
  modoOperacion?: string;
  redPreferida?: string;
  //
  deviceName?: string;
  //
  ultimoRegistro?: IRegistro;
  ultimaAlerta?: IAlerta;
}
