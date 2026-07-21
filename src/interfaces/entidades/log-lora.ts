import { TipoLoraServer } from "../tenant/lora-server.model";

export type TipoEventoLora = "up" | "join" | "ack" | "status" | "log" | "txack";

export interface ILogLora {
  _id?: string;
  deveui?: string;
  deviceName?: string;
  fuente?: TipoLoraServer;
  tipoEvento?: TipoEventoLora;
  body?: object;
  fecha?: string;
  dispositivoEncontrado?: boolean;
  tipoDispositivo?: string;
  reenviado?: boolean;
  descartado?: boolean;
  motivoDescarte?: string;
  codigoRespuesta?: number;
  tiempoRespuesta?: number;
  respuesta?: object;
}

////// CREATE
type OmitirCreate = "_id";
export interface ICreateLogLora extends Omit<Partial<ILogLora>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = "_id";
export interface IUpdateLogLora extends Omit<Partial<ILogLora>, OmitirUpdate> {}
