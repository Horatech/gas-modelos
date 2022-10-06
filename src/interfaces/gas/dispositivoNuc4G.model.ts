import { IAlerta } from "./alerta";
import { IRegistro } from "./registro.model";

export interface IDispositivoNuc4G {
  _id: string;
  idCliente: string;
  deveui: string;
  firmwareNuc?: string;
  apiVersion?: string;
  frecuenciaComunicacion?: number;
  horaInicio?: number;
  modoOperacion?: string;
  redPreferida?: string;
  //
  fechaCreacion: string;
  deviceName?: string;
  //
  ultimoRegistro?: IRegistro;
  ultimaAlerta?: IAlerta;
}
