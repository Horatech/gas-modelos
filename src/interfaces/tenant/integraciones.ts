import { z } from "zod";

export const IntegracionInfluxV1Schema = z.object({
  host: z.string().optional(),
  port: z.string().optional(),
  protocol: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  dbName: z.string().optional(),
  measurement: z.string().optional(),
});
export type IIntegracionInfluxV1 = z.infer<typeof IntegracionInfluxV1Schema>;

export const IntegracionInfluxV2Schema = z.object({
  host: z.string().optional(),
  port: z.string().optional(),
  protocol: z.string().optional(),
  token: z.string().optional(),
  dbName: z.string().optional(),
  measurement: z.string().optional(),
  org: z.string().optional(),
});
export type IIntegracionInfluxV2 = z.infer<typeof IntegracionInfluxV2Schema>;

export const IntegracionSchema = z.object({
  tipoDispositivo: z.string().optional(),
  tipoIntegracion: z.enum(["INFLUXV1", "INFLUXV2", "HTTPS", "FTP"]).optional(), // SQL / MONGODB
  endpoint: z.string().optional(), // https://miapi.com
  puerto: z.number().optional(), // 8080
  method: z.enum(["GET", "POST", "PUT", "PATCH"]).optional(),
  credenciales: z
    .union([IntegracionInfluxV1Schema, IntegracionInfluxV2Schema])
    .optional(),
  credenciales2: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .optional(),
  ubicacionCredenciales: z.enum(["Query Params", "Headers", "Body"]).optional(),
  // Integración de altas/asociaciones + devolución de lecturas (p. ej. Manantial
  // de AYSAM). Las integraciones históricas modelan push OUTBOUND; estos campos
  // agregan la ingesta pull INBOUND y el perfil del adaptador.
  direccion: z.enum(["INBOUND_PULL", "OUTBOUND_API"]).optional(),
  perfil: z.enum(["MANANTIAL"]).optional(), // adaptador/mapper específico del sistema externo
  endpointIngesta: z.string().optional(), // base del GET de altas (p. ej. .../mediciones/v1)
  // Watermark de la ingesta incremental (idempotencia / "solo lo nuevo").
  cursorAltas: z.string().optional(),
  ultimaSincronizacion: z.string().optional(),
});
export type IIntegracion = z.infer<typeof IntegracionSchema>;
