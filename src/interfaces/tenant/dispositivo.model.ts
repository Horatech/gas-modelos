import { ICliente } from "./cliente.model";
import { TipoConectividad, TipoDispositivo } from "./dispositivo.dto";

export interface IDispositivo {
  _id: string;
  fechaCreacion: string;
  idCliente: string;
  deveui: string;
  deviceName: string;
  appkey: string;
  tipoDispositivo: TipoDispositivo;
  conectividad: TipoConectividad;
  // Virtuals
  cliente?: ICliente;
}
