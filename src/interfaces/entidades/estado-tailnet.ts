import { z } from "zod";

/**
 * Estado del tailnet de mantenimiento (Headscale + relay DERP propios), tal como
 * lo arma gas-admin para el admin de INSIDEht. Sólo lectura: sale de la API de
 * Headscale (vía el proxy de sólo lectura del cluster) y de una prueba al relay.
 */

/** Resultado de consultar un componente del tailnet (control o relay). */
export const ServicioTailnetSchema = z.object({
  ok: z.boolean(),
  /** Tiempo de respuesta de la consulta, en ms */
  latenciaMs: z.number().optional(),
  /** Motivo cuando ok = false */
  error: z.string().optional(),
});
export type IServicioTailnet = z.infer<typeof ServicioTailnetSchema>;

export const NodoTailnetSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  /** IPs del tailnet (IPv4 100.64.0.0/10 e IPv6) */
  ips: z.array(z.string()),
  /** Tags de la policy (ej. tag:camuzzi-vm). Un nodo con tags es un equipo, no una persona. */
  tags: z.array(z.string()),
  /** Usuario de Headscale, sólo en nodos de persona (sin tags) */
  usuario: z.string().optional(),
  /** true = nodo con tags (VM de cliente): su caída es alerta. Los de persona no. */
  esEquipo: z.boolean(),
  online: z.boolean(),
  /** Última vez que Headscale lo vio conectado (ISO 8601) */
  ultimaConexion: z.string().optional(),
  /** Minutos desde ultimaConexion, sólo si está offline */
  minutosDesconectado: z.number().optional(),
  /** Vencimiento de la clave del nodo (ISO 8601). Los equipos con tag no vencen. */
  vence: z.string().optional(),
  /** Alta en el tailnet (ISO 8601) */
  alta: z.string().optional(),
  /** Equipo offline más minutos que el umbral */
  enAlerta: z.boolean(),
});
export type INodoTailnet = z.infer<typeof NodoTailnetSchema>;

export const TipoAlertaTailnetSchema = z.enum(["control", "relay", "nodo"]);
export type TipoAlertaTailnet = z.infer<typeof TipoAlertaTailnetSchema>;

export const AlertaTailnetSchema = z.object({
  tipo: TipoAlertaTailnetSchema,
  mensaje: z.string(),
  /** Nombre del nodo, en alertas de tipo nodo */
  nodo: z.string().optional(),
});
export type IAlertaTailnet = z.infer<typeof AlertaTailnetSchema>;

export const EstadoTailnetSchema = z.object({
  /** Momento de la consulta (ISO 8601) */
  consultado: z.string(),
  /** Servidor de control (Headscale) */
  control: ServicioTailnetSchema,
  /** Relay DERP */
  relay: ServicioTailnetSchema,
  nodos: z.array(NodoTailnetSchema),
  alertas: z.array(AlertaTailnetSchema),
  /** Minutos offline a partir de los cuales un equipo entra en alerta */
  umbralMinutos: z.number(),
});
export type IEstadoTailnet = z.infer<typeof EstadoTailnetSchema>;
