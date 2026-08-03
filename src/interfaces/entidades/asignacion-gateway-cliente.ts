import { z } from "zod";
import { ClienteSchema } from "../tenant/cliente.model";
import { GatewayLorawanSchema } from "./gateway-lorawan";

/**
 * Asigna un gateway LoRaWAN a un cliente que tiene
 * `config.moduloCoberturaLorawan.activo`. Relación N-a-N: un mismo gateway
 * físico puede ser visible por varios clientes (red LoRaWAN compartida).
 *
 * La cobertura del cliente se filtra por los `gatewayId` (EUI64) aquí
 * asignados, ya que `ICoberturaLorawan.gateways[]` referencia a los gateways
 * de forma embebida por `gatewayId` (no por `_id`).
 */
export const AsignacionGatewayClienteSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  /** `_id` del documento GatewayLorawan en gas-datos */
  idGatewayLorawan: z.string().optional(),
  /** EUI64 denormalizado del gateway, para filtrar coberturas sin populate */
  gatewayId: z.string().optional(),
  fechaCreacion: z.string().optional(),

  // Virtuals
  cliente: ClienteSchema.optional(),
  gateway: GatewayLorawanSchema.optional(),
});
export type IAsignacionGatewayCliente = z.infer<typeof AsignacionGatewayClienteSchema>;

// CREATE / UPDATE
const omitir = { _id: true, cliente: true, gateway: true, fechaCreacion: true } as const;

export const CreateAsignacionGatewayClienteSchema =
  AsignacionGatewayClienteSchema.omit(omitir);
export type ICreateAsignacionGatewayCliente = z.infer<
  typeof CreateAsignacionGatewayClienteSchema
>;

export const UpdateAsignacionGatewayClienteSchema =
  AsignacionGatewayClienteSchema.omit(omitir);
export type IUpdateAsignacionGatewayCliente = z.infer<
  typeof UpdateAsignacionGatewayClienteSchema
>;
