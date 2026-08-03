import { z } from "zod";
import { ClienteSchema } from "../tenant/cliente.model";
import { LoraServerSchema } from "../tenant/lora-server.model";
import { DispositivoSchema } from "./dispositivo";

/**
 * Control y auditoría del downlink de configuración de un NME.
 *
 * Cada documento representa el `reporte_mask` que se pidió aplicar a un equipo y
 * para el cual se programa un SET_CONFIG (fPort 100, 4 bytes) hacia ChirpStack.
 * Clave lógica: `deveui` — hay a lo sumo un downlink de config vigente por
 * equipo, el último upsert pisa al anterior.
 *
 * Dos productores lo crean: el fan-out de gas-api-cliente al guardar la
 * Configuración Global, y la pasada de alta de gas-cron para un equipo nuevo.
 *
 * **La existencia del documento es lo que hace que esto sea de un solo tiro.**
 * La pasada de alta solo toma equipos que NUNCA tuvieron control: si un técnico
 * cambió el mask por BLE, el control ya existe y no se lo vuelve a pisar.
 */
export const EstadoConfigDownlinkNmeSchema = z.enum([
  "pendiente", // fan-out hecho, aún no encolado
  "esperando_equipo", // sin tz conocida; NO consume intentos
  "encolado", // job creado en la cola de downlinks
  "enviado", // downlink en ChirpStack, esperando el fPort 100 de respuesta
  "confirmado", // TERMINAL: el reporteMask observado iguala al solicitado
  "agotado", // TERMINAL: se alcanzó el tope de intentos
  "error", // falló el último enqueue; se reintenta
]);
export type EstadoConfigDownlinkNme = z.infer<typeof EstadoConfigDownlinkNmeSchema>;

export const IntentoConfigDownlinkNmeSchema = z.object({
  fecha: z.string().optional(), // ISO del intento
  resultado: z.enum(["ok", "error"]).optional(),
  error: z.string().optional(), // mensaje si resultado = 'error'
});
export type IIntentoConfigDownlinkNme = z.infer<typeof IntentoConfigDownlinkNmeSchema>;

export const ConfigDownlinkNmeSchema = z.object({
  _id: z.string().optional(),
  //
  deveui: z.string().optional(),
  deviceName: z.string().optional(),
  //
  // Config solicitada (la que viaja en el downlink)
  reporteMask: z.number().optional(),
  /**
   * tz con la que se armó el downlink. El SET_CONFIG de 4 B lleva tz + mask
   * juntos: no hay forma de mandar solo el mask. Se reenvía la que el propio
   * equipo reportó por fPort 100.
   */
  tz: z.number().optional(),
  //
  estado: EstadoConfigDownlinkNmeSchema.optional(),
  intentos: z.number().optional(),
  ultimoIntento: z.string().optional(),
  historialIntentos: z.array(IntentoConfigDownlinkNmeSchema).optional(),
  //
  fechaSolicitud: z.string().optional(),
  fechaEnviado: z.string().optional(),
  fechaConfirmado: z.string().optional(),
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
export type IConfigDownlinkNme = z.infer<typeof ConfigDownlinkNmeSchema>;

////// CREATE / UPDATE
const omitir = {
  _id: true,
  cliente: true,
  dispositivo: true,
  loraServer: true,
} as const;

export const CreateConfigDownlinkNmeSchema = ConfigDownlinkNmeSchema.omit(omitir);
export type ICreateConfigDownlinkNme = z.infer<typeof CreateConfigDownlinkNmeSchema>;

export const UpdateConfigDownlinkNmeSchema = ConfigDownlinkNmeSchema.omit(omitir);
export type IUpdateConfigDownlinkNme = z.infer<typeof UpdateConfigDownlinkNmeSchema>;
