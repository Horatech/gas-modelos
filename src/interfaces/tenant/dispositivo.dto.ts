import { TipoDispositivo } from "./tipo-dispositivo.model";

export type TipoConectividad = "4G" | "LORA";

export interface ICreateDispositivo {
  idCliente: string;
  deveui: string;
  deviceName: string;
  appkey?: string;
  idLote?: string;
  tipoDispositivo: TipoDispositivo;
  conectividad: TipoConectividad;
  // Solo con conectividad Lora
  idLoraServer?: string;
}

export interface IUpdateDispositivo {
  idCliente?: string;
  deveui?: string;
  deviceName?: string;
  appkey?: string;
  idLote?: string;
  tipoDispositivo?: TipoDispositivo;
  conectividad?: TipoConectividad;
  // Solo con conectividad Lora
  idLoraServer?: string;
  //
  idUnidadNegocio?: string;
  idCuenca?: string;
}
