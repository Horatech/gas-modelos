import { ICoordenadas, TipoDispositivo } from "../auxiliares";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ICliente } from "../tenant/cliente.model";
import { ILoraServer } from "../tenant/lora-server.model";
import { ILoteDispositivo } from "../tenant/loteDispositivo.model";
import { IAlerta } from "./alerta";
import { IRegistro } from "./registro";

export type TipoConectividad = "4G" | "LORA";

export interface IDispositivo {
  // Info autogenerada
  _id?: string;
  fechaCreacion?: string;
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
  // Virtuals
  cliente?: ICliente;
  lote?: ILoteDispositivo;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  loraServer?: ILoraServer;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "dispositivo";
export interface ICreateDispositivo
  extends Omit<Partial<IDispositivo>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "dispositivo";
export interface IUpdateDispositivo
  extends Omit<Partial<IDispositivo>, OmitirUpdate> {}
