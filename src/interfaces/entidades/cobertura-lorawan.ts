import { GeoJSON, ICoordenadas } from "../auxiliares";

/**
 * Recepción de un uplink de cobertura por un gateway individual.
 */
export interface IGatewayCobertura {
  gatewayId?: string;
  rssi?: number;
  snr?: number;
  ubicacion?: ICoordenadas;
  /** Distancia great-circle dispositivo-gateway en metros (si el gateway tiene ubicación) */
  distancia?: number;
}

/**
 * Medición de cobertura LoRaWAN georeferenciada.
 * Generada por gas-field-tester a partir de uplinks del RAK10701
 * (field tester) u otros dispositivos con GPS.
 */
export interface ICoberturaLorawan {
  _id?: string;
  /** DevEUI del dispositivo que midió */
  deveui?: string;
  deviceName?: string;
  fecha?: string;
  /** Posición del dispositivo al momento de la medición */
  ubicacion?: ICoordenadas;
  /** Punto GeoJSON para queries geoespaciales (índice 2dsphere) */
  geojson?: GeoJSON;
  altitud?: number;
  hdop?: number;
  satelites?: number;
  /** fPort del uplink (1 = corto, 11 = extendido) */
  fPort?: number;
  fCnt?: number;
  /** Data rate del uplink */
  dr?: number;
  /** Spreading factor */
  sf?: number;
  /** Frecuencia en Hz */
  frecuencia?: number;
  /** Gateways que recibieron el uplink */
  gateways?: IGatewayCobertura[];
  cantidadGateways?: number;
  minRssi?: number;
  maxRssi?: number;
  minSnr?: number;
  maxSnr?: number;
  /** Distancias en metros (solo gateways con ubicación) */
  minDistancia?: number;
  maxDistancia?: number;
}

// CREATE
type OmitirCreate = "_id";
export interface ICreateCoberturaLorawan
  extends Omit<Partial<ICoberturaLorawan>, OmitirCreate> {}
