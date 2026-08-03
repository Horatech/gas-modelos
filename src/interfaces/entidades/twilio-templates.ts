import { z } from "zod";
import { ConfigTwilioSchema } from "../tenant/cliente.model";

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'Estado de presión {{1}} en el punto de medición {{2}} con un valor de {{3}}. Horatech.'
 * @param estado Estado de la presión {{1}}
 * @param punto Punto de medición {{2}}
 * @param valor Valor de la presión {{3}}
 * @param sid HXfb4194701ce4baf115447c6b0baad06c
 */
export const TwilioPresionTemplateSchema = z.object({
  1: z.string(),
  2: z.string(),
  3: z.string(),
  sid: z.string(),
});
export type ITwilioPresionTemplate = z.infer<typeof TwilioPresionTemplateSchema>;

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'Punto de medición {{1}} pasado a estado En Mantenimiento. Horatech.'
 * @param punto Punto de medición {{1}}
 * @param sid HX36663f2a4ef4b29455df5cc6c6eb00a8
 */
export const TwilioMantenimientoTemplateSchema = z.object({
  1: z.string(),
  sid: z.string(),
});
export type ITwilioMantenimientoTemplate = z.infer<
  typeof TwilioMantenimientoTemplateSchema
>;

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'Sensor deconectado en el punto de medición {{1}}. Horatech.'
 * @param punto Punto de medición {{1}}
 * @param sid HXa73924c271c567499fc61c8e3c629909
 */
export const TwilioSensorDesconectadoTemplateSchema = z.object({
  1: z.string(),
  sid: z.string(),
});
export type ITwilioSensorDesconectadoTemplate = z.infer<
  typeof TwilioSensorDesconectadoTemplateSchema
>;

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'Error de comunicación de alarma. Estado de presión {{1}} en el punto de medición {{2}} con un valor de {{3}} con fecha {{4}}. Horatech.'
 * @param estado Estado de la presión {{1}}
 * @param punto Punto de medición {{2}}
 * @param valor Valor de la presión {{3}}
 * @param fecha Fecha del error {{4}}
 * @param sid HX30c8f98ac067a102c2ec970482b393ba
 */
export const TwilioErrorComunicacionAlarmaTemplateSchema = z.object({
  1: z.string(),
  2: z.string(),
  3: z.string(),
  4: z.string(),
  sid: z.string(),
});
export type ITwilioErrorComunicacionAlarmaTemplate = z.infer<
  typeof TwilioErrorComunicacionAlarmaTemplateSchema
>;

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'Se ha restablecido el valor en el punto {{1}}. Horatech.'
 * @param punto Punto de medición {{1}}
 * @param sid HX79264e34254ed1f65121644a3f4d8979
 */
export const TwilioScadaBooleanoReestablecidoTemplateSchema = z.object({
  1: z.string(),
  sid: z.string(),
});
export type ITwilioScadaBooleanoReestablecidoTemplate = z.infer<
  typeof TwilioScadaBooleanoReestablecidoTemplateSchema
>;

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'El valor {{1}} ha vuelto a estar dentro los niveles normales en el punto {{2}}. Horatech.'
 * @param valor Valor {{1}}
 * @param punto Punto de medición {{2}}
 * @param sid HX9bb2b5180e4d9a25b67423bc2e5eb43f
 */
export const TwilioScadaValorReestablecidoTemplateSchema = z.object({
  1: z.string(),
  2: z.string(),
  sid: z.string(),
});
export type ITwilioScadaValorReestablecidoTemplate = z.infer<
  typeof TwilioScadaValorReestablecidoTemplateSchema
>;

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'El límite {{1}} del punto {{2}} ha sido cambiado a {{3}}. Horatech.'
 * @param limite Límite {{1}}
 * @param punto Punto de medición {{2}}
 * @param valor Valor {{3}}
 * @param sid HX062696564a7a45eb649751fb6bb98220
 */
export const TwilioScadaCambioLimiteTemplateSchema = z.object({
  1: z.string(),
  2: z.string(),
  3: z.string(),
  sid: z.string(),
});
export type ITwilioScadaCambioLimiteTemplate = z.infer<
  typeof TwilioScadaCambioLimiteTemplateSchema
>;

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'El punto {{1}} ha reportado el valor {{2}}. El valor de alarma es {{3}}. Horatech.'
 * @param punto Punto de medición {{1}}
 * @param valor Valor {{2}}
 * @param alarma Valor de alarma {{3}}
 * @param sid HXe87e6d98251d55a6a6ddf000c3146b75
 */
export const TwilioScadaBooleanoAlertaTemplateSchema = z.object({
  1: z.string(),
  2: z.string(),
  3: z.string(),
  sid: z.string(),
});
export type ITwilioScadaBooleanoAlertaTemplate = z.infer<
  typeof TwilioScadaBooleanoAlertaTemplateSchema
>;

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'El valor {{1}} ha sobrepasado el nivel {{2}} en el punto {{3}}. Horatech.'
 * @param valor Valor {{1}}
 * @param nivel Nivel {{2}}
 * @param punto Punto de medición {{3}}
 * @param sid HX77a6e9216b71d1ab0a0f7ecb479956c4
 */
export const TwilioFueraDeLimiteTemplateSchema = z.object({
  1: z.string(),
  2: z.string(),
  3: z.string(),
  sid: z.string(),
});
export type ITwilioFueraDeLimiteTemplate = z.infer<
  typeof TwilioFueraDeLimiteTemplateSchema
>;

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'Alerta de {{1}}, el valor {{2}} a sobrepasado el nivel {{3}} en el punto {{4}}.'
 * @param tipo Tipo {{1}} // Ejemplo: presión, temperatura, caudal, etc.
 * @param valor Valor {{2}} // Ejemplo: 100 psi, 50 °C, 200 l/s, etc.
 * @param nivel Nivel {{3}} // Ejemplo: límite máximo, límite mínimo, etc.
 * @param punto Punto de medición {{4}}
 * @param sid HX77a6e9216b71d1ab0a0f7ecb479956c4
 */
export const TwilioScadaFueraDeLimiteTemplateSchema = z.object({
  1: z.string(),
  2: z.string(),
  3: z.string(),
  4: z.string(),
  sid: z.string(),
});
export type ITwilioScadaFueraDeLimiteTemplate = z.infer<
  typeof TwilioScadaFueraDeLimiteTemplateSchema
>;

// `{ [key: number]: string; sid: string }`: el índice numérico se modela con
// `.catchall()` (mismo patrón que IEmailGenerico/EmailGenericoSchema más abajo).
export const TwilioMsgGenericTemplateSchema = z
  .object({ sid: z.string() })
  .catchall(z.string());
export type ITwilioMsgGenericTemplate = z.infer<
  typeof TwilioMsgGenericTemplateSchema
>;

export const MensajeTwilioSchema = z.object({
  datos: z
    .union([
      TwilioMsgGenericTemplateSchema,
      TwilioErrorComunicacionAlarmaTemplateSchema,
      TwilioMantenimientoTemplateSchema,
      TwilioPresionTemplateSchema,
      TwilioScadaBooleanoAlertaTemplateSchema,
      TwilioScadaBooleanoReestablecidoTemplateSchema,
      TwilioScadaCambioLimiteTemplateSchema,
      TwilioScadaValorReestablecidoTemplateSchema,
      TwilioSensorDesconectadoTemplateSchema,
      TwilioFueraDeLimiteTemplateSchema,
      TwilioScadaFueraDeLimiteTemplateSchema,
    ])
    .optional(),
  pais: z.string().optional(),
  telefono: z.string().optional(),
  idCliente: z.string().optional(),
  usuario: z.string().optional(),
  twilio: ConfigTwilioSchema.optional(),
  extra: z.record(z.string(), z.any()).optional(),
});
export type IMensajeTwilio = z.infer<typeof MensajeTwilioSchema>;

export const SMSTwilioSchema = z.object({
  pais: z.string().optional(),
  telefono: z.string().optional(),
  mensaje: z.string().optional(),
  idCliente: z.string().optional(),
  usuario: z.string().optional(),
  twilio: ConfigTwilioSchema.optional(),
  extra: z.record(z.string(), z.any()).optional(),
});
export type ISMSTwilio = z.infer<typeof SMSTwilioSchema>;

export const LlamadaTwilioSchema = z.object({
  telefono: z.string().optional(),
  mensaje: z.string().optional(),
  idCliente: z.string().optional(),
  usuario: z.string().optional(),
  twilio: ConfigTwilioSchema.optional(),
  extra: z.record(z.string(), z.any()).optional(),
});
export type ILlamadaTwilio = z.infer<typeof LlamadaTwilioSchema>;

// EMAIL

export const EmailDataBaseSchema = z.object({
  sid: z.string(),
  subject: z.string().optional(),
});
export type IEmailDataBase = z.infer<typeof EmailDataBaseSchema>;

export const EmailGenericoSchema = EmailDataBaseSchema.catchall(
  z.string().optional(),
);
export type IEmailGenerico = z.infer<typeof EmailGenericoSchema>;

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'El valor de presión {{1}} está fuera de rango del límite {{2}} de {{3}} para {{4}} de el Punto de Medición {{5}}. Fecha y hora del evento: {{6}}.'
 * @param presion Presión {{1}}
 * @param nombreLimite Nombre límite {{2}}
 * @param valorLimite Valor límite {{3}}
 * @param variable Variable {{4}}
 * @param puntoMedicion Punto de medición {{5}}
 * @param fecha Fecha {{6}}
 * @param sid HX77a6e9216b71d1ab0a0f7ecb479956c4
 */
export const EmailFueraDeLimiteSchema = EmailDataBaseSchema.extend({
  presion: z.string(),
  variable: z.string(),
  nombreLimite: z.string(),
  valorLimite: z.string(),
  puntoMedicion: z.string(),
  fecha: z.string(),
});
export type IEmailFueraDeLimite = z.infer<typeof EmailFueraDeLimiteSchema>;

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'El valor de presión {{1}} volvió a valores normales para {{2}} de el Punto de Medición {{3}}. Fecha y hora del evento: {{4}}'
 * @param presion Presión {{1}}
 * @param variable Variable {{2}}
 * @param puntoMedicion Punto de medición {{3}}
 * @param fecha Fecha {{4}}
 * @param sid HX77a6e9216b71d1ab0a0f7ecb479956c4
 */
export const EmailLimiteReestablecidoSchema = EmailDataBaseSchema.extend({
  presion: z.string(),
  variable: z.string(),
  puntoMedicion: z.string(),
  fecha: z.string(),
});
export type IEmailLimiteReestablecido = z.infer<
  typeof EmailLimiteReestablecidoSchema
>;

export const EmailResetPasswordSchema = EmailDataBaseSchema.extend({
  token: z.string(),
});
export type IEmailResetPassword = z.infer<typeof EmailResetPasswordSchema>;

export const EmailNuevoUsuarioSchema = EmailDataBaseSchema.extend({
  usuario: z.string(),
  password: z.string(),
});
export type IEmailNuevoUsuario = z.infer<typeof EmailNuevoUsuarioSchema>;

export const EmailCambioPasswordSchema = EmailDataBaseSchema.extend({
  codigo: z.string(),
});
export type IEmailCambioPassword = z.infer<typeof EmailCambioPasswordSchema>;

export const EmailTwilioSchema = z.object({
  email: z.string().optional(),
  datos: z
    .union([
      EmailGenericoSchema,
      EmailFueraDeLimiteSchema,
      EmailLimiteReestablecidoSchema,
      EmailResetPasswordSchema,
      EmailNuevoUsuarioSchema,
      EmailCambioPasswordSchema,
    ])
    .optional(),
  idCliente: z.string().optional(),
  usuario: z.string().optional(),
  twilio: ConfigTwilioSchema.optional(),
  extra: z.record(z.string(), z.any()).optional(),
});
export type IEmailTwilio = z.infer<typeof EmailTwilioSchema>;
