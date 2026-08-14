import { z } from "zod";
import { CoordenadasSchema, GeoJSONSchema } from "../auxiliares/coordenadas";

/**
 * Recepción de un uplink por un gateway individual.
 *
 * Un uplink LoRaWAN no es "el RSSI del dispositivo": es una recepción por cada
 * gateway que lo escuchó. Ese detalle llega en `IUplink.metadatos[]` a
 * gas-entrada-lora y hasta ahora se descartaba.
 */
export const GatewayRecepcionSchema = z.object({
  /** EUI64 del gateway en el network server */
  gatewayId: z.string().optional(),
  rssi: z.number().optional(),
  snr: z.number().optional(),
  /**
   * Distancia great-circle dispositivo-gateway en metros. Se calcula contra
   * `IGatewayLorawan.ubicacion`, NUNCA contra el `location` de `rxInfo`: los
   * gateways hospedados reportan la ubicación estática del packet forwarder
   * (los tres de ITCSA informan Chascomús estando en Mendoza).
   */
  distancia: z.number().optional(),
});
export type IGatewayRecepcion = z.infer<typeof GatewayRecepcionSchema>;

/**
 * Estado del enlace en el último uplink recibido. Se embebe en `IDispositivo`
 * para que el mapa y el detalle del punto de medición lo lean sin pegarle a la
 * colección histórica.
 */
export const UltimaRecepcionSchema = z.object({
  fecha: z.string().optional(),
  fCnt: z.number().optional(),
  fPort: z.number().optional(),
  /** Data rate del uplink */
  dr: z.number().optional(),
  /** Spreading factor derivado del data rate */
  sf: z.number().optional(),
  /** Frecuencia en Hz */
  frecuencia: z.number().optional(),
  /** Ancho de banda en Hz (de txInfo) */
  bandwidth: z.number().optional(),
  /** Code rate (de txInfo, ej. "4/5") */
  codeRate: z.string().optional(),
  adr: z.boolean().optional(),
  /** Una entrada por gateway que escuchó el uplink */
  gateways: z.array(GatewayRecepcionSchema).optional(),
  /** Diversidad de recepción: cuántos gateways lo escucharon */
  cantidadGateways: z.number().optional(),
  /** `gatewayId` del gateway con mejor RSSI */
  mejorGatewayId: z.string().optional(),
  minRssi: z.number().optional(),
  maxRssi: z.number().optional(),
  minSnr: z.number().optional(),
  maxSnr: z.number().optional(),
});
export type IUltimaRecepcion = z.infer<typeof UltimaRecepcionSchema>;

/**
 * Recepción histórica de un uplink. La escribe gas-entrada-lora en lote (mismo
 * patrón que `ILogLora`) y la colección tiene TTL: no es el reporte del
 * dispositivo, es la traza del enlace.
 *
 * Sin virtuals de populate a propósito: `IDispositivo`/`IPuntoMedicion` son
 * parte del SCC de dispositivo y un schema real de ese lado cierra el ciclo
 * (ver CLAUDE.md). Lo que se necesita para mostrar la fila va denormalizado.
 */
export const RecepcionUplinkSchema = UltimaRecepcionSchema.extend({
  _id: z.string().optional(),
  deveui: z.string().optional(),
  deviceName: z.string().optional(),
  idDispositivo: z.string().optional(),
  idLoraServer: z.string().optional(),
  idCliente: z.string().optional(),
  idPuntoMedicion: z.string().optional(),
  /** Ubicación del dispositivo/punto al momento de la recepción */
  ubicacion: CoordenadasSchema.optional(),
  /** Punto GeoJSON para queries geoespaciales (índice 2dsphere) */
  geojson: GeoJSONSchema.optional(),
});
export type IRecepcionUplink = z.infer<typeof RecepcionUplinkSchema>;

// CREATE
export const CreateRecepcionUplinkSchema = RecepcionUplinkSchema.omit({
  _id: true,
});
export type ICreateRecepcionUplink = z.infer<typeof CreateRecepcionUplinkSchema>;
