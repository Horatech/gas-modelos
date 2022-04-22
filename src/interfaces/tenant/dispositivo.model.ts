import { ICuenca, IUnidadNegocio } from "../gas";
import { ICliente } from "./cliente.model";
import { TipoConectividad } from "./dispositivo.dto";
import { ILoraServer } from "./lora-server.model";
import { ILoteDispositivo } from "./loteDispositivo.model";
import { TipoDispositivo } from "./tipo-dispositivo.model";

export interface IDispositivo {
  _id: string;
  fechaCreacion: string;
  idCliente: string;
  deveui: string;
  deviceName: string;
  appkey: string;
  idLote: string;
  tipoDispositivo: TipoDispositivo;
  conectividad: TipoConectividad;
  // Solo con conectividad Lora
  idLoraServer?: string;
  // Datos que carga el cliente
  idUnidadNegocio?: string;
  idCuenca?: string;
  // Virtuals
  cliente?: ICliente;
  lote?: ILoteDispositivo;
  unidadNegocio?: IUnidadNegocio;
  cuenca?: ICuenca;
  loraServer?: ILoraServer;
}
