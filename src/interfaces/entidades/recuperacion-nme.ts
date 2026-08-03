import { z } from "zod";
import { ClienteSchema } from "../tenant/cliente.model";
import { LoraServerSchema } from "../tenant/lora-server.model";
import { DispositivoSchema } from "./dispositivo";

/**
 * Control y auditoría de la recuperación de registros faltantes de un NME.
 *
 * Cada documento representa un DÍA (UTC) de un dispositivo que se detectó
 * incompleto en la colección `registrosmedidorelectrico` y para el cual se
 * programa un downlink GET_HISTORIC (fPort 108) hacia ChirpStack.
 *
 * Sirve a la vez como:
 *  - control anti-loop (tope de `intentos`; días > 30 días quedan fuera del
 *    buffer del device y no se piden),
 *  - registro de auditoría consultable (qué se pidió, cuándo, con qué resultado
 *    y estado final).
 *
 * Clave lógica: (`deveui`, `dia`).
 */
export const EstadoRecuperacionNmeSchema = z.enum([
  "pendiente", // hueco detectado, aún no encolado
  "encolado", // job creado en la cola de downlinks
  "enviado", // downlink GET_HISTORIC enviado a ChirpStack
  "recuperado", // el día quedó completo en registrosmedidorelectrico
  "sin_datos", // el equipo confirmó que ese día no tiene registros (fPort 34
  //               motivo 1). TERMINAL: no re-pedir nunca. Distinto de 'agotado':
  //               acá el dato NO EXISTE, no es que no lo pudimos traer.
  "fecha_invalida", // pedimos un día futuro (fPort 34 motivo 3). TERMINAL:
  //                    reintentar repite el error. Distinto de 'error', que es un
  //                    fallo TRANSITORIO del enqueue y sí se reintenta.
  "agotado", // se alcanzó el tope de intentos sin recuperar
  "error", // último enqueue falló (transitorio, se reintenta)
]);
export type EstadoRecuperacionNme = z.infer<typeof EstadoRecuperacionNmeSchema>;

export const IntentoRecuperacionNmeSchema = z.object({
  fecha: z.string().optional(), // ISO del intento
  resultado: z.enum(["ok", "error"]).optional(),
  error: z.string().optional(), // mensaje si resultado = 'error'
  /**
   * Motivo del uplink fPort 34 que cerró el intento, si lo hubo:
   * 1 = día terminado sin registros · 2 = día en curso · 3 = fecha futura.
   * Con `resultado: 'ok'` (el intercambio funcionó; lo que no hay es dato).
   */
  motivo: z.number().optional(),
});
export type IIntentoRecuperacionNme = z.infer<
  typeof IntentoRecuperacionNmeSchema
>;

export const RecuperacionNmeSchema = z.object({
  _id: z.string().optional(),
  //
  deveui: z.string().optional(),
  deviceName: z.string().optional(),
  dia: z.string().optional(), // ISO 00:00:00.000Z del día (UTC) a recuperar
  //
  estado: EstadoRecuperacionNmeSchema.optional(),
  intentos: z.number().optional(), // contador de downlinks enviados (tope configurable)
  ultimoIntento: z.string().optional(), // ISO del último envío
  historialIntentos: z.array(IntentoRecuperacionNmeSchema).optional(), // acotado al tope de intentos
  //
  fechaDeteccion: z.string().optional(), // ISO en que se detectó el hueco
  fechaRecuperado: z.string().optional(), // ISO en que se confirmó el día completo
  //
  idLoraServer: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  //
  fechaCreacion: z.string().optional(),
  fechaActualizacion: z.string().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  dispositivo: DispositivoSchema.optional(),
  loraServer: LoraServerSchema.optional(),
});
export type IRecuperacionNme = z.infer<typeof RecuperacionNmeSchema>;

////// CREATE
export const CreateRecuperacionNmeSchema = RecuperacionNmeSchema.omit({
  _id: true,
  cliente: true,
  dispositivo: true,
  loraServer: true,
});
export type ICreateRecuperacionNme = z.infer<
  typeof CreateRecuperacionNmeSchema
>;

////// UPDATE
export const UpdateRecuperacionNmeSchema = RecuperacionNmeSchema.omit({
  _id: true,
  cliente: true,
  dispositivo: true,
  loraServer: true,
});
export type IUpdateRecuperacionNme = z.infer<
  typeof UpdateRecuperacionNmeSchema
>;
