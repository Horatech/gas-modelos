import { z } from "zod";
import { ClienteSchema } from "../tenant/cliente.model";
import { LoraServerSchema } from "../tenant/lora-server.model";
import { DispositivoSchema } from "./dispositivo";

/**
 * Control y auditoría del downlink de configuración de un medidor de agua EUW300.
 *
 * Cada documento representa la configuración de reporte (hora del reporte diario
 * + intervalo de comunicación) que se solicitó aplicar a un EUW300 y para la cual
 * se programa un downlink SET_CONFIG (trama DL/T645) hacia ChirpStack.
 *
 * A diferencia del control de recuperación NME (uno por día), acá la clave lógica
 * es solo `deveui`: hay a lo sumo un downlink de config vigente por dispositivo
 * (el último upsert pisa al anterior). gas-api-cliente crea/actualiza el documento
 * en estado `pendiente` cuando el usuario guarda la config desde la web; gas-cron
 * lo detecta, encola y envía el downlink de forma controlada (rate-limited).
 *
 * Sirve a la vez como control anti-loop (tope de `intentos`) y como auditoría
 * consultable (qué se pidió, cuándo y con qué resultado).
 */
export const EstadoConfigDownlinkEuw300Schema = z.enum([
  "pendiente", // config guardada desde la web, aún no encolada
  "encolado", // job creado en la cola de downlinks
  "enviado", // downlink SET_CONFIG encolado en ChirpStack (a la espera de ack)
  "confirmado", // el device confirmó (ack=true) la recepción del downlink
  "agotado", // se alcanzó el tope de intentos sin éxito
  "error", // último enqueue falló
]);
export type EstadoConfigDownlinkEuw300 = z.infer<typeof EstadoConfigDownlinkEuw300Schema>;

export const IntentoConfigDownlinkEuw300Schema = z.object({
  fecha: z.string().optional(), // ISO del intento
  resultado: z.enum(["ok", "error"]).optional(),
  error: z.string().optional(), // mensaje si resultado = 'error'
});
export type IIntentoConfigDownlinkEuw300 = z.infer<
  typeof IntentoConfigDownlinkEuw300Schema
>;

export const ConfigDownlinkEuw300Schema = z.object({
  _id: z.string().optional(),
  //
  deveui: z.string().optional(),
  deviceName: z.string().optional(),
  deviceMeterNumber: z.string().optional(), // S/N (14 dígitos BCD) usado para armar la trama
  //
  // Config solicitada (la que viaja en el downlink)
  horaReporteDiario: z.string().optional(), // formato "HH:mm"
  intervaloComunicacion: z.number().optional(), // minutos entre reportes
  //
  estado: EstadoConfigDownlinkEuw300Schema.optional(),
  intentos: z.number().optional(), // contador de downlinks enviados (tope configurable)
  ultimoIntento: z.string().optional(), // ISO del último envío
  historialIntentos: z.array(IntentoConfigDownlinkEuw300Schema).optional(), // acotado al tope de intentos
  //
  fechaSolicitud: z.string().optional(), // ISO en que el usuario guardó la config
  fechaEnviado: z.string().optional(), // ISO en que se encoló el downlink en ChirpStack
  fechaConfirmado: z.string().optional(), // ISO del ack=true del device (Clase A)
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
export type IConfigDownlinkEuw300 = z.infer<typeof ConfigDownlinkEuw300Schema>;

////// CREATE / UPDATE
const omitir = {
  _id: true,
  cliente: true,
  dispositivo: true,
  loraServer: true,
} as const;

export const CreateConfigDownlinkEuw300Schema = ConfigDownlinkEuw300Schema.omit(omitir);
export type ICreateConfigDownlinkEuw300 = z.infer<
  typeof CreateConfigDownlinkEuw300Schema
>;

export const UpdateConfigDownlinkEuw300Schema = ConfigDownlinkEuw300Schema.omit(omitir);
export type IUpdateConfigDownlinkEuw300 = z.infer<
  typeof UpdateConfigDownlinkEuw300Schema
>;
