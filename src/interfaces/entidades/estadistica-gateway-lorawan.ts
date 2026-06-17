/**
 * Estadística agregada de un gateway LoRaWAN en un intervalo de tiempo.
 * Obtenida de la API de stats del network server (ChirpStack):
 * v3 GET /api/gateways/{id}/stats, v4 GatewayService.GetMetrics.
 *
 * Permite métricas que el NS no resuelve por uplink: interferencia
 * (rxCrcFail = rxReceived - rxReceivedOK) y ocupación de canal
 * (rxPorFrecuencia / rxPorDr).
 */
export type IntervaloEstadisticaGateway = "MINUTE" | "HOUR" | "DAY";

export interface IEstadisticaGatewayLorawan {
  _id?: string;
  /** EUI64 del gateway en el network server */
  gatewayId?: string;
  idLoraServer?: string;
  /** Inicio del bucket de agregación */
  fecha?: string;
  intervalo?: IntervaloEstadisticaGateway;
  /** Paquetes recibidos por la radio del gateway (rxPacketsReceived) */
  rxReceived?: number;
  /** Paquetes recibidos que pasaron CRC/decodificación (rxPacketsReceivedOK) */
  rxReceivedOK?: number;
  /** Derivado: rxReceived - rxReceivedOK. Proxy de interferencia/colisión. */
  rxCrcFail?: number;
  txReceived?: number;
  txEmitted?: number;
  /** Conteo de paquetes rx por frecuencia (Hz) — ocupación de canal */
  rxPorFrecuencia?: Record<string, number>;
  /** Conteo de paquetes rx por data rate */
  rxPorDr?: Record<string, number>;
  txPorFrecuencia?: Record<string, number>;
  txPorDr?: Record<string, number>;
}

// CREATE
type OmitirCreate = "_id";
export interface ICreateEstadisticaGatewayLorawan
  extends Omit<Partial<IEstadisticaGatewayLorawan>, OmitirCreate> {}
