import { ICliente } from "../tenant";
import { IGatewayLorawan } from "./gateway-lorawan";

/**
 * Asigna un gateway LoRaWAN a un cliente que tiene
 * `config.moduloCoberturaLorawan.activo`. Relación N-a-N: un mismo gateway
 * físico puede ser visible por varios clientes (red LoRaWAN compartida).
 *
 * La cobertura del cliente se filtra por los `gatewayId` (EUI64) aquí
 * asignados, ya que `ICoberturaLorawan.gateways[]` referencia a los gateways
 * de forma embebida por `gatewayId` (no por `_id`).
 */
export interface IAsignacionGatewayCliente {
  _id?: string;
  idCliente?: string;
  /** `_id` del documento GatewayLorawan en gas-datos */
  idGatewayLorawan?: string;
  /** EUI64 denormalizado del gateway, para filtrar coberturas sin populate */
  gatewayId?: string;
  fechaCreacion?: string;

  // Virtuals
  cliente?: ICliente;
  gateway?: IGatewayLorawan;
}

// CREATE
type OmitirCreate = "_id" | "cliente" | "gateway" | "fechaCreacion";
export interface ICreateAsignacionGatewayCliente
  extends Omit<Partial<IAsignacionGatewayCliente>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id" | "cliente" | "gateway" | "fechaCreacion";
export interface IUpdateAsignacionGatewayCliente
  extends Omit<Partial<IAsignacionGatewayCliente>, OmitirUpdate> {}
