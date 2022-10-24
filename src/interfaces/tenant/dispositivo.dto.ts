import { ICoordenadas } from "../auxiliares";
import { IAlerta, IRegistro } from "../gas";
import { TipoDispositivo } from "./tipo-dispositivo.model";

export type TipoConectividad = "4G" | "LORA";

export interface ICreateDispositivo {
  idCliente: string;
  // Info de carga
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
  // Tenant
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  // Info de carga
  deveui?: string;
  deviceName?: string;
  appkey?: string;
  conectividad?: TipoConectividad;
  idLote?: string;
  tipoDispositivo?: TipoDispositivo;
  // Solo con conectividad Lora
  idLoraServer?: string;
  // Info de comunicacion
  snr?: number;
  rssi?: number;
  adr?: boolean;
  dr?: number;
  fechaUltimaComunicacion?: string;
  // Otra info
  firmware?: string;
  ubicacion?: ICoordenadas;
  // Info especifica de cada tipo de dispositivo
  config?: Record<string, any>;
  ultimoReporte?: IRegistro;
  ultimaAlerta?: IAlerta;
}
