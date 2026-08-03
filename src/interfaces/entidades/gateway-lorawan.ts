import { z } from "zod";
import { CoordenadasSchema } from "../auxiliares/coordenadas";
import { LoraServerSchema } from "../tenant/lora-server.model";

export const EstadoGatewayLorawanSchema = z.enum(["NEVER_SEEN", "ONLINE", "OFFLINE"]);
export type EstadoGatewayLorawan = z.infer<typeof EstadoGatewayLorawanSchema>;

/**
 * Gateway LoRaWAN sincronizado desde el network server (ChirpStack v3/v4).
 * Mantenido por gas-field-tester (sync periódico vía API REST).
 */
export const GatewayLorawanSchema = z.object({
  _id: z.string().optional(),
  /** EUI64 del gateway en el network server */
  gatewayId: z.string().optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  /** Tenant de ChirpStack al que pertenece */
  tenantId: z.string().optional(),
  idLoraServer: z.string().optional(),
  ubicacion: CoordenadasSchema.optional(),
  altitud: z.number().optional(),
  /** Origen de la ubicación reportado por el NS (GPS = fix real, CONFIG = tipeada) */
  locationSource: z.enum(["UNKNOWN", "GPS", "CONFIG", "GEO_RESOLVER"]).optional(),
  /** Precisión de la ubicación en metros (location.accuracy del NS) */
  locationAccuracy: z.number().optional(),
  estado: EstadoGatewayLorawanSchema.optional(),
  lastSeenAt: z.string().optional(),
  /** Región/subbanda configurada (ej. au915_3) */
  region: z.string().optional(),
  /** propertiesMap completo del NS (modelo/firmware/region_config_id, etc.) */
  propiedades: z.record(z.string(), z.string()).optional(),
  /** Fecha de alta del gateway en el NS (Gateway.createdAt, v4) */
  createdAtNs: z.string().optional(),
  /** Fecha de última modificación en el NS (Gateway.updatedAt, v4) */
  updatedAtNs: z.string().optional(),
  /** Intervalo de stats configurado en el NS en segundos (v4) */
  statsInterval: z.number().optional(),
  /** Última sincronización contra el network server */
  fechaSync: z.string().optional(),

  // Virtuals
  loraServer: LoraServerSchema.optional(),
});
export type IGatewayLorawan = z.infer<typeof GatewayLorawanSchema>;

// CREATE
export const CreateGatewayLorawanSchema = GatewayLorawanSchema.omit({
  _id: true,
  loraServer: true,
});
export type ICreateGatewayLorawan = z.infer<typeof CreateGatewayLorawanSchema>;

// UPDATE
export const UpdateGatewayLorawanSchema = GatewayLorawanSchema.omit({
  _id: true,
  loraServer: true,
  gatewayId: true,
});
export type IUpdateGatewayLorawan = z.infer<typeof UpdateGatewayLorawanSchema>;
