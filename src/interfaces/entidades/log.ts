import { z } from "zod";
import { DeviceInfoSchema } from "../auxiliares/deviceInfo";
import { TenantInfoGasSchema } from "../auxiliares/tenentInfo";

/**
 * Colección `logs`: diagnóstico y trazabilidad de comunicaciones.
 *
 * REGLA: esto NO es para series de datos de alto volumen. Reportes y registros
 * se quedan en sus propias colecciones. Si un log nuevo va a entrar a razón de
 * miles por minuto, no entra acá.
 *
 * La base junta lo que viene SIEMPRE, sea NFC, LoRa, HTTP o lo que venga. El
 * discriminante `tipo` elige qué hay en `datos`, que es el contenido parseado
 * de ese tipo puntual. `raw` es de la base a propósito: cualquier comunicación
 * tiene un crudo, y es lo que salva cuando el parseo de hoy resulta incompleto.
 *
 * Los cuatro logs viejos (logNuc, logLora, logReporte, logTwilio) NO se migran
 * acá: no coinciden ni en el nombre del campo de fecha y unificarlos tocaría
 * datos ya escritos.
 */
export const TipoLogSchema = z.enum(["NFC"]);
export type TipoLog = z.infer<typeof TipoLogSchema>;

/** Quién emitió el log. `instancia` es el agrupador por aparato emisor. */
export const OrigenLogSchema = z.object({
  sistema: z.string().optional(), // "gas-mobile"
  instancia: z.string().optional(), // ANDROID_ID del teléfono
  version: z.string().optional(), // versión de la app que lo emitió
});
export type IOrigenLog = z.infer<typeof OrigenLogSchema>;

export const UbicacionLogSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  precision: z.number().optional(), // metros
  fecha: z.string().optional(), // del fix, no del hecho logueado
});
export type IUbicacionLog = z.infer<typeof UbicacionLogSchema>;

export const LogBaseSchema = z.object({
  _id: z.string().optional(),
  fecha: z.string().optional(), // cuándo ocurrió, reloj del emisor
  fechaRecepcion: z.string().optional(), // cuándo entró al backend
  origen: OrigenLogSchema.optional(),
  tenant: TenantInfoGasSchema.optional(),
  device: DeviceInfoSchema.optional(),
  idEntidad: z.string().optional(),
  entidad: z.string().optional(), // a qué colección apunta idEntidad
  ubicacion: UbicacionLogSchema.optional(),
  resultado: z.enum(["ok", "error", "parcial"]).optional(),
  codigoRespuesta: z.number().optional(),
  tiempoRespuesta: z.number().optional(),
  raw: z.string().optional(),
  idIdempotencia: z.string().optional(), // único: el reintento no duplica
});

////// NFC

export const DatosLogNfcSchema = z.object({
  tag: z
    .object({
      uid: z.string().optional(), // hex
      atqa: z.string().optional(), // hex
      sak: z.string().optional(), // hex
      techList: z.array(z.string()).optional(),
      historicalBytes: z.string().optional(), // hex, sólo IsoDep
    })
    .optional(),
  telefono: z
    .object({
      fabricante: z.string().optional(),
      modelo: z.string().optional(),
      versionSo: z.string().optional(),
    })
    .optional(),
  pantalla: z.string().optional(),
  motivoCierre: z.enum(["inactividad", "otro-tag", "background"]).optional(),
  transceives: z
    .array(
      z.object({
        seq: z.number(),
        offsetMillis: z.number(), // desde la apertura del contacto
        tipo: z.string(), // Kind de NfcTrace: TX | NOTE | WARN | ERROR | RESULT
        op: z.string(),
        tx: z.string().optional(), // hex
        rx: z.string().optional(), // hex
        ms: z.number().optional(),
        detalle: z.string().optional(),
      }),
    )
    .optional(),
});
export type IDatosLogNfc = z.infer<typeof DatosLogNfcSchema>;

export const LogNfcSchema = LogBaseSchema.extend({
  tipo: z.literal("NFC"),
  datos: DatosLogNfcSchema.optional(),
});

////// UNIÓN

export const LogSchema = z.discriminatedUnion("tipo", [LogNfcSchema]);
export type ILogAny = z.infer<typeof LogSchema>;
export type ILog<T extends TipoLog = TipoLog> = Extract<ILogAny, { tipo: T }>;

////// CREATE
// El omit va por variante: una unión discriminada no tiene .omit().
export const CreateLogNfcSchema = LogNfcSchema.omit({
  _id: true,
  fechaRecepcion: true,
});
export const CreateLogSchema = z.discriminatedUnion("tipo", [
  CreateLogNfcSchema,
]);
export type ICreateLogAny = z.infer<typeof CreateLogSchema>;
export type ICreateLog<T extends TipoLog = TipoLog> = Extract<
  ICreateLogAny,
  { tipo: T }
>;
