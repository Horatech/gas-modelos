import { z } from "zod";
import type { ITipoAlerta } from "./alerta";

/**
 * Estado de la integración on-premise de un cliente: el enlace (nodos del tailnet
 * declarados en `config.onPremise.tags`) y el adaptador OPC-UA. Un documento por
 * cliente. Lo escribe únicamente el evaluador de gas-cron; gas-api-integraciones
 * sólo guarda el último heartbeat.
 */

/**
 * Lo que el adaptador OPC-UA manda a gas-api-integraciones cada minuto
 * (`POST /integracion/heartbeat`). La apikey identifica al cliente.
 */
export const HeartbeatIntegracionScadaSchema = z.object({
  /** Arranque del proceso (ISO 8601). Si cambia, el proceso se reinició. */
  arranque: z.string(),
  /** Momento del envío según el reloj del adaptador (ISO 8601) */
  enviado: z.string(),
  /** Sesión OPC-UA abierta */
  conectado: z.boolean(),
  /** Desde cuándo está perdida la conexión con el servidor OPC-UA (ISO 8601). Ausente si está conectado. */
  conexionPerdidaDesde: z.string().optional(),
  /** Última notificación de datos de la suscripción (ISO 8601). Ausente si no llegó ninguna desde el arranque. */
  ultimoDato: z.string().optional(),
  /** Operaciones OPC-UA rechazadas (escrituras y lecturas) acumuladas desde el arranque */
  rechazosOpc: z.number(),
  tags: z.number(),
  monitoredItems: z.number(),
  sesionesAbiertas: z.number(),
  /** Versión (commit) de la imagen del adaptador */
  version: z.string().optional(),
});
export type IHeartbeatIntegracionScada = z.infer<typeof HeartbeatIntegracionScadaSchema>;

export const EstadoEnlaceOnPremiseSchema = z.enum([
  "Conectado",
  "Desconectado",
  /** No se pudo consultar el tailnet: se conserva el último estado conocido. */
  "Sin información",
]);
export type EstadoEnlaceOnPremise = z.infer<typeof EstadoEnlaceOnPremiseSchema>;

/** En orden de precedencia: se muestra el primero que se cumple. */
export const EstadoIntegracionScadaSchema = z.enum([
  "Sin señal",
  "Sin conexión",
  "Sin datos",
  "Con errores",
  "Operativa",
]);
export type EstadoIntegracionScada = z.infer<typeof EstadoIntegracionScadaSchema>;

/** Alerta que corresponde a cada estado. Los estados sanos no abren alerta. */
export const TIPO_ALERTA_POR_ESTADO_ENLACE: Partial<Record<EstadoEnlaceOnPremise, ITipoAlerta>> = {
  Desconectado: "Enlace desconectado",
};
export const TIPO_ALERTA_POR_ESTADO_INTEGRACION: Partial<
  Record<EstadoIntegracionScada, ITipoAlerta>
> = {
  "Sin señal": "Integración SCADA sin señal",
  "Sin conexión": "Integración SCADA sin conexión",
  "Sin datos": "Integración SCADA sin datos",
  "Con errores": "Integración SCADA con errores",
};

export const NodoEnlaceOnPremiseSchema = z.object({
  nombre: z.string(),
  online: z.boolean(),
  /** Última vez que Headscale lo vio (ISO 8601) */
  ultimaConexion: z.string().optional(),
});
export type INodoEnlaceOnPremise = z.infer<typeof NodoEnlaceOnPremiseSchema>;

export const EstadoComponenteEnlaceSchema = z.object({
  estado: EstadoEnlaceOnPremiseSchema,
  /** Desde cuándo está en este estado (ISO 8601) */
  desde: z.string(),
  /** Última evaluación con datos del tailnet (ISO 8601) */
  actualizado: z.string().optional(),
  nodos: z.array(NodoEnlaceOnPremiseSchema).optional(),
});
export type IEstadoComponenteEnlace = z.infer<typeof EstadoComponenteEnlaceSchema>;

/** Muestra del contador de rechazos, para la ventana de "Con errores". */
export const MuestraRechazosSchema = z.object({
  /** Recepción del heartbeat (ISO 8601) */
  fecha: z.string(),
  arranque: z.string(),
  acumulado: z.number(),
});
export type IMuestraRechazos = z.infer<typeof MuestraRechazosSchema>;

export const EstadoComponenteIntegracionSchema = z.object({
  estado: EstadoIntegracionScadaSchema,
  desde: z.string(),
  /** Última evaluación (ISO 8601) */
  actualizado: z.string().optional(),
  /** Último heartbeat recibido, tal cual */
  heartbeat: HeartbeatIntegracionScadaSchema.optional(),
  /** Recepción del último heartbeat según el reloj de la plataforma (ISO 8601) */
  heartbeatRecibido: z.string().optional(),
  /**
   * Último dato visto, el máximo entre heartbeats (ISO 8601): un reinicio del
   * adaptador borra su `ultimoDato` pero no éste.
   */
  ultimoDato: z.string().optional(),
  muestrasRechazos: z.array(MuestraRechazosSchema).optional(),
  /** Último momento en que la ventana tuvo rechazos por encima del umbral (ISO 8601) */
  ultimoConErrores: z.string().optional(),
});
export type IEstadoComponenteIntegracion = z.infer<typeof EstadoComponenteIntegracionSchema>;

export const ComponenteOnPremiseSchema = z.enum(["enlace", "integracionScada"]);
export type ComponenteOnPremise = z.infer<typeof ComponenteOnPremiseSchema>;

/** Cambio de estado detectado por el evaluador. En modo `observacion` es lo único que queda. */
export const TransicionOnPremiseSchema = z.object({
  fecha: z.string(),
  componente: ComponenteOnPremiseSchema,
  de: z.string(),
  a: z.string(),
  /** Modo del cliente al momento de la transición */
  modo: z.string(),
});
export type ITransicionOnPremise = z.infer<typeof TransicionOnPremiseSchema>;

export const EstadoOnPremiseSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string(),
  enlace: EstadoComponenteEnlaceSchema.optional(),
  integracionScada: EstadoComponenteIntegracionSchema.optional(),
  /** Últimas transiciones, la más reciente primero (acotado) */
  transiciones: z.array(TransicionOnPremiseSchema).optional(),
  fechaActualizacion: z.string().optional(),
});
export type IEstadoOnPremise = z.infer<typeof EstadoOnPremiseSchema>;
