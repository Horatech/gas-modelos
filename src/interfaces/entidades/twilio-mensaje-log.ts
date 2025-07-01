import { ICliente } from "../tenant";
export type TwilioMessageStatus =
  | "queued"
  | "sending"
  | "sent"
  | "failed"
  | "delivered"
  | "undelivered"
  | "receiving"
  | "received"
  | "accepted"
  | "scheduled"
  | "read"
  | "partially_delivered"
  | "canceled";

export type TwilioMessageDirection =
  | "inbound"
  | "outbound-api"
  | "outbound-call"
  | "outbound-reply";

export interface ITwilioMensajeLog {
  _id: string;
  fechaCreacion?: string;
  idCliente?: string;
  phone?: string;
  sid?: string;
  body?: string;
  direction?: TwilioMessageDirection;
  status?: TwilioMessageStatus;
  error?: boolean;
  /// Solo en error
  errorCode?: string;
  errorMessage?: string;

  // Datos extra enviados por el servicio que llamo a la api
  extra?: Record<string, any>;
  // Populate
  cliente?: ICliente;
}

////// CREATE
type OmitirCreate = "_id" | "fechaCreacion" | "cliente";
export interface ICreateTwilioMensajeLog
  extends Omit<Partial<ITwilioMensajeLog>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = "_id" | "fechaCreacion" | "cliente";
export interface IUpdateTwilioMensajeLog
  extends Omit<Partial<ITwilioMensajeLog>, OmitirUpdate> {}
