export type TipoDispositivo = "NUC" | "SML";
export type TipoConectividad = "4G" | "LORA";

export interface ICreateDispositivo {
  idCliente: string;
  deveui: string;
  deviceName: string;
  appkey?: string;
  idLote?: string;
  tipoDispositivo: TipoDispositivo;
  conectividad: TipoConectividad;
}

export interface IUpdateDispositivo {
  idCliente?: string;
  deveui?: string;
  deviceName?: string;
  appkey?: string;
  idLote?: string;
  tipoDispositivo?: TipoDispositivo;
  conectividad?: TipoConectividad;
  //
  idUnidadNegocio?: string;
  idCuenca?: string;
}
