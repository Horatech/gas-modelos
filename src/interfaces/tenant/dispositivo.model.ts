import { ICoordenadas } from "../auxiliares";
import { IAlerta, ICentroOperativo, IRegistro, IUnidadNegocio } from "../gas";
import { ICliente } from "./cliente.model";
import { TipoConectividad } from "./dispositivo.dto";
import { ILoraServer } from "./lora-server.model";
import { ILoteDispositivo } from "./loteDispositivo.model";
import { TipoDispositivo } from "./tipo-dispositivo.model";

export interface IDispositivo {
  // Info autogenerada
  _id: string;
  fechaCreacion: string;
  // Tenant
  idCliente: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  // Info de carga
  deveui: string;
  deviceName: string;
  appkey: string;
  conectividad: TipoConectividad;
  idLote?: string;
  tipoDispositivo: TipoDispositivo;
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
