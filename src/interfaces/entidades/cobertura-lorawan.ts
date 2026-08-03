import { z } from "zod";
import { CoordenadasSchema, GeoJSONSchema } from "../auxiliares/coordenadas";

/**
 * Recepción de un uplink de cobertura por un gateway individual.
 */
export const GatewayCoberturaSchema = z.object({
  gatewayId: z.string().optional(),
  rssi: z.number().optional(),
  snr: z.number().optional(),
  ubicacion: CoordenadasSchema.optional(),
  /** Altitud del gateway en metros (de rxInfo[].location.altitude) */
  altitud: z.number().optional(),
  /** Distancia great-circle dispositivo-gateway en metros (si el gateway tiene ubicación) */
  distancia: z.number().optional(),
});
export type IGatewayCobertura = z.infer<typeof GatewayCoberturaSchema>;

/**
 * Medición de cobertura LoRaWAN georeferenciada.
 * Generada por gas-field-tester a partir de uplinks del RAK10701
 * (field tester) u otros dispositivos con GPS.
 */
export const CoberturaLorawanSchema = z.object({
  _id: z.string().optional(),
  /** DevEUI del dispositivo que midió */
  deveui: z.string().optional(),
  deviceName: z.string().optional(),
  fecha: z.string().optional(),
  /** Posición del dispositivo al momento de la medición */
  ubicacion: CoordenadasSchema.optional(),
  /** Punto GeoJSON para queries geoespaciales (índice 2dsphere) */
  geojson: GeoJSONSchema.optional(),
  altitud: z.number().optional(),
  hdop: z.number().optional(),
  satelites: z.number().optional(),
  /** Precisión estimada del fix GPS en metros: (hdop*5+5)/10 */
  accuracy: z.number().optional(),
  /** Medición sin fix GPS válido: conserva RSSI/SNR/diversidad pero no se ubica en el mapa */
  sinFix: z.boolean().optional(),
  /** fPort del uplink (1 = corto, 11 = extendido) */
  fPort: z.number().optional(),
  fCnt: z.number().optional(),
  /** Data rate del uplink */
  dr: z.number().optional(),
  /** Spreading factor */
  sf: z.number().optional(),
  /** Frecuencia en Hz */
  frecuencia: z.number().optional(),
  /** Ancho de banda en Hz (de txInfo) */
  bandwidth: z.number().optional(),
  /** Code rate (de txInfo, ej. "4/5") */
  codeRate: z.string().optional(),
  /** Gateways que recibieron el uplink */
  gateways: z.array(GatewayCoberturaSchema).optional(),
  cantidadGateways: z.number().optional(),
  minRssi: z.number().optional(),
  maxRssi: z.number().optional(),
  minSnr: z.number().optional(),
  maxSnr: z.number().optional(),
  /** Distancias en metros (solo gateways con ubicación) */
  minDistancia: z.number().optional(),
  maxDistancia: z.number().optional(),
});
export type ICoberturaLorawan = z.infer<typeof CoberturaLorawanSchema>;

// CREATE
export const CreateCoberturaLorawanSchema = CoberturaLorawanSchema.omit({
  _id: true,
});
export type ICreateCoberturaLorawan = z.infer<typeof CreateCoberturaLorawanSchema>;
