export type TipoDispositivo = "NUC 4G" | "SML";
export type TipoConectividad = "4G" | "LORA";

export interface ICreateDispositivo {
  idCliente: string;
  deveui: string;
  deviceName: string;
  appkey: string;
  tipoDispositivo: TipoDispositivo;
  conectividad: TipoConectividad;
}

export interface IUpdateDispositivo {
  idCliente?: string;
  deveui?: string;
  deviceName?: string;
  appkey?: string;
  tipoDispositivo?: TipoDispositivo;
  conectividad?: TipoConectividad;
}
