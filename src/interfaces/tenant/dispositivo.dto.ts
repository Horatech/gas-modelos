export interface ICreateDispositivo {
  idCliente: string;
  deveui: string;
  deviceName?: string;
}

export interface IUpdateDispositivo {
  idCliente?: string;
  deveui?: string;
  deviceName?: string;
}
