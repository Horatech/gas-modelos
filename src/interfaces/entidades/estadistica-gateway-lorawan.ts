import { z } from "zod";

/**
 * Estadística agregada de un gateway LoRaWAN en un intervalo de tiempo.
 * Obtenida de la API de stats del network server (ChirpStack):
 * v3 GET /api/gateways/{id}/stats, v4 GatewayService.GetMetrics.
 *
 * Permite métricas que el NS no resuelve por uplink: interferencia
 * (rxCrcFail = rxReceived - rxReceivedOK) y ocupación de canal
 * (rxPorFrecuencia / rxPorDr).
 */
export const IntervaloEstadisticaGatewaySchema = z.enum(["MINUTE", "HOUR", "DAY"]);
export type IntervaloEstadisticaGateway = z.infer<
  typeof IntervaloEstadisticaGatewaySchema
>;

export const EstadisticaGatewayLorawanSchema = z.object({
  _id: z.string().optional(),
  /** EUI64 del gateway en el network server */
  gatewayId: z.string().optional(),
  idLoraServer: z.string().optional(),
  /** Inicio del bucket de agregación */
  fecha: z.string().optional(),
  intervalo: IntervaloEstadisticaGatewaySchema.optional(),
  /** Paquetes recibidos por la radio del gateway (rxPacketsReceived) */
  rxReceived: z.number().optional(),
  /** Paquetes recibidos que pasaron CRC/decodificación (rxPacketsReceivedOK) */
  rxReceivedOK: z.number().optional(),
  /** Derivado: rxReceived - rxReceivedOK. Proxy de interferencia/colisión. */
  rxCrcFail: z.number().optional(),
  txReceived: z.number().optional(),
  txEmitted: z.number().optional(),
  /** Conteo de paquetes rx por frecuencia (Hz) — ocupación de canal */
  rxPorFrecuencia: z.record(z.string(), z.number()).optional(),
  /** Conteo de paquetes rx por data rate */
  rxPorDr: z.record(z.string(), z.number()).optional(),
  txPorFrecuencia: z.record(z.string(), z.number()).optional(),
  txPorDr: z.record(z.string(), z.number()).optional(),
});
export type IEstadisticaGatewayLorawan = z.infer<typeof EstadisticaGatewayLorawanSchema>;

// CREATE
export const CreateEstadisticaGatewayLorawanSchema =
  EstadisticaGatewayLorawanSchema.omit({ _id: true });
export type ICreateEstadisticaGatewayLorawan = z.infer<
  typeof CreateEstadisticaGatewayLorawanSchema
>;
