export type TipoDispositivo = "NUC 4G" | "SML";

export interface ICreateDispositivo {
  idCliente: string;
  deveui: string;
  tipoDispositivo: TipoDispositivo;
  deviceName?: string;
  appkey?: string;
}

export interface IUpdateDispositivo {
  idCliente?: string;
  deveui?: string;
  tipoDispositivo?: TipoDispositivo;
  deviceName?: string;
  appkey?: string;
}
