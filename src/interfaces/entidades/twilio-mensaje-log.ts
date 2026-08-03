import { z } from "zod";
import { ClienteSchema } from "../tenant/cliente.model";
import { TipoMensajeTwilioSchema } from "./log-twilio";

export const TwilioMessageStatusSchema = z.enum([
  "queued",
  "sending",
  "sent",
  "failed",
  "delivered",
  "undelivered",
  "receiving",
  "received",
  "accepted",
  "scheduled",
  "read",
  "partially_delivered",
  "canceled",
]);
export type TwilioMessageStatus = z.infer<typeof TwilioMessageStatusSchema>;

export const TwilioMessageDirectionSchema = z.enum([
  "inbound",
  "outbound-api",
  "outbound-call",
  "outbound-reply",
]);
export type TwilioMessageDirection = z.infer<
  typeof TwilioMessageDirectionSchema
>;

export const TwilioMensajeLogSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  idCliente: z.string().optional(),
  tipo: TipoMensajeTwilioSchema.optional(),
  email: z.string().optional(), // Solo si es email

  // Respuesta de Twilio
  phone: z.string().optional(),
  sid: z.string().optional(),
  body: z.string().optional(),
  direction: TwilioMessageDirectionSchema.optional(),
  status: TwilioMessageStatusSchema.optional(),
  error: z.boolean().optional(),
  /// Solo en error
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),

  // Datos extra enviados por el servicio que llamo a la api
  extra: z.record(z.string(), z.any()).optional(),
  // Populate
  cliente: ClienteSchema.optional(),
});
export type ITwilioMensajeLog = z.infer<typeof TwilioMensajeLogSchema>;

////// CREATE
export const CreateTwilioMensajeLogSchema = TwilioMensajeLogSchema.omit({
  _id: true,
  fechaCreacion: true,
  cliente: true,
});
export type ICreateTwilioMensajeLog = z.infer<
  typeof CreateTwilioMensajeLogSchema
>;

////// UPDATE
export const UpdateTwilioMensajeLogSchema = TwilioMensajeLogSchema.omit({
  _id: true,
  fechaCreacion: true,
  cliente: true,
});
export type IUpdateTwilioMensajeLog = z.infer<
  typeof UpdateTwilioMensajeLogSchema
>;
