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
  estado?: EstadoGatewayLorawan;
  lastSeenAt?: string;
  /** Región/subbanda configurada (ej. au915_3) */
  region?: string;
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
