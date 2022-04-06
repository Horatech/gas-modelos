import { TipoDispositivo } from "./dispositivo.dto";

export interface IDispositivo {
  _id: string;
  idCliente: string;
  deveui: string;
  tipoDispotivivo: TipoDispositivo;
  deviceName?: string;
  appkey?: string;
  fechaCreacion: string;
}
