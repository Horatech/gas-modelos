import { ICoordenadas } from "../auxiliares";
import { ILoraServer } from "../tenant";

export type EstadoGatewayLorawan = "NEVER_SEEN" | "ONLINE" | "OFFLINE";

/**
 * Gateway LoRaWAN sincronizado desde el network server (ChirpStack v3/v4).
 * Mantenido por gas-field-tester (sync periódico vía API REST).
 */
export interface IGatewayLorawan {
  _id?: string;
  /** EUI64 del gateway en el network server */
  gatewayId?: string;
  nombre?: string;
  descripcion?: string;
  /** Tenant de ChirpStack al que pertenece */
  tenantId?: string;
  idLoraServer?: string;
  ubicacion?: ICoordenadas;
  altitud?: number;
  /** Origen de la ubicación reportado por el NS (GPS = fix real, CONFIG = tipeada) */
  locationSource?: "UNKNOWN" | "GPS" | "CONFIG" | "GEO_RESOLVER";
  /** Precisión de la ubicación en metros (location.accuracy del NS) */
  locationAccuracy?: number;
  estado?: EstadoGatewayLorawan;
  lastSeenAt?: string;
  /** Región/subbanda configurada (ej. au915_3) */
  region?: string;
  /** propertiesMap completo del NS (modelo/firmware/region_config_id, etc.) */
  propiedades?: Record<string, string>;
  /** Fecha de alta del gateway en el NS (Gateway.createdAt, v4) */
  createdAtNs?: string;
  /** Fecha de última modificación en el NS (Gateway.updatedAt, v4) */
  updatedAtNs?: string;
  /** Intervalo de stats configurado en el NS en segundos (v4) */
  statsInterval?: number;
  /** Última sincronización contra el network server */
  fechaSync?: string;

  // Virtuals
  loraServer?: ILoraServer;
}

// CREATE
type OmitirCreate = "_id" | "loraServer";
export interface ICreateGatewayLorawan
  extends Omit<Partial<IGatewayLorawan>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id" | "loraServer" | "gatewayId";
export interface IUpdateGatewayLorawan
  extends Omit<Partial<IGatewayLorawan>, OmitirUpdate> {}
