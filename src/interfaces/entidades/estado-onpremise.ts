import { z } from "zod";
import type { ITipoAlerta } from "./alerta";

/**
 * Estado de la integración on-premise de un cliente, en tres componentes:
 * - `enlace` ("Túnel" frente al cliente): nodos del tailnet declarados en `config.onPremise.tags`
 *   y la sonda de punta a punta del canal (la plataforma le pide al leaf `$JS.<dominio>.API.INFO`).
 * - `integracionScada` ("Puente OPC-UA"): el adaptador OPC-UA.
 * - `historian` ("Conector Historian"): el lector del historiador.
 *
 * Los heartbeats del puente y del conector viajan por el canal: con el túnel caído no llegan. Por
 * eso, con el enlace "Desconectado", esos dos quedan "Sin información" y no abren alerta propia.
 *
 * Un documento por cliente. Lo escribe únicamente el evaluador de gas-cron; gas-api-integraciones
 * sólo guarda el último heartbeat y la última sonda. Plan: `gas/PLAN-HISTORIAN-CAMUZZI.md` §10.
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
  /**
   * Operaciones OPC-UA rechazadas por la INTEGRACIÓN (timeouts, sesión, canal…) acumuladas desde
   * el arranque. Es lo que usa el estado "Con errores".
   */
  rechazosOpc: z.number(),
  /**
   * Rechazos de CONFIGURACIÓN (ver `CODIGOS_OPC_CONFIGURACION`) acumulados desde el arranque.
   * Informativo: cada uno abre su alerta por tag y no suma a "Con errores".
   */
  rechazosConfiguracion: z.number().optional(),
  tags: z.number(),
  monitoredItems: z.number(),
  sesionesAbiertas: z.number(),
  /** Versión (commit) de la imagen del adaptador */
  version: z.string().optional(),
  /** Canal por el túnel: muestras sin confirmar por el leaf (buffer del adaptador). */
  pendientesAdaptador: z.number().optional(),
  /** Canal por el túnel: último PubAck recibido del leaf (ISO 8601). */
  ultimoAckLeaf: z.string().optional(),
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
  /** El túnel está caído: el heartbeat no puede llegar. No abre alerta. */
  "Sin información",
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

/**
 * Sonda de punta a punta del túnel: gas-api-integraciones le pide al leaf de la VM
 * `$JS.<dominio>.API.INFO` por el canal cada minuto. La contesta el propio leaf, así que no depende
 * del adaptador ni del lector.
 */
export const SondaTunelSchema = z.object({
  /** Momento de la sonda, reloj de la plataforma (ISO 8601) */
  fecha: z.string(),
  ok: z.boolean(),
  /** Ida y vuelta, si respondió */
  rttMs: z.number().optional(),
  error: z.string().optional(),
  /** Última sonda que respondió (ISO 8601) */
  ultimaOk: z.string().optional(),
});
export type ISondaTunel = z.infer<typeof SondaTunelSchema>;

export const EstadoComponenteEnlaceSchema = z.object({
  estado: EstadoEnlaceOnPremiseSchema,
  /** Desde cuándo está en este estado (ISO 8601) */
  desde: z.string(),
  /** Última evaluación con datos del tailnet (ISO 8601) */
  actualizado: z.string().optional(),
  nodos: z.array(NodoEnlaceOnPremiseSchema).optional(),
  /** Última sonda del canal */
  sonda: SondaTunelSchema.optional(),
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

// ── Conector Historian ───────────────────────────────────────────────────────────────────────

/**
 * Lo que el lector del Historian publica cada minuto por el canal (`subjectEstadoHistorian`).
 * El account de NATS identifica al cliente.
 */
export const HeartbeatConectorHistorianSchema = z.object({
  /** Arranque del proceso (ISO 8601). Si cambia, el proceso se reinició. */
  arranque: z.string(),
  /** Momento del envío según el reloj del lector (ISO 8601) */
  enviado: z.string(),
  /** Versión (commit) de la imagen */
  version: z.string().optional(),
  /** false = interruptor apagado (pausa deliberada) */
  habilitado: z.boolean(),
  tagsDeclarados: z.number(),
  tagsPermitidos: z.number(),
  /** Credencial con la que la puerta consulta el Historian */
  token: z.object({
    fuente: z.enum(["archivo", "cliente"]),
    /** La puerta tiene un token utilizable */
    ok: z.boolean(),
    /** Vencimiento del token vigente (ISO 8601), si se conoce */
    vence: z.string().optional(),
    error: z.string().optional(),
  }),
  /** Sonda periódica al Historian (`serverproperties`, no lee tags) */
  sonda: z.object({
    ultimaOk: z.string().optional(),
    ultimoError: z.string().optional(),
    error: z.string().optional(),
    /** HTTP del último error (401/403 = credencial rechazada) */
    http: z.number().optional(),
    ms: z.number().optional(),
    /** `ReadQueueSize` del Historian en la última sonda */
    colaLectura: z.number().optional(),
  }),
  /** Consultas atendidas desde el arranque */
  consultas: z.object({
    ok: z.number(),
    rechazadas: z.number(),
    errores: z.number(),
  }),
  cortacircuitoAbierto: z.boolean(),
});
export type IHeartbeatConectorHistorian = z.infer<typeof HeartbeatConectorHistorianSchema>;

/** En orden de precedencia: se muestra el primero que se cumple. */
export const EstadoConectorHistorianSchema = z.enum([
  /** El túnel está caído: el heartbeat no puede llegar. No abre alerta. */
  "Sin información",
  "Sin señal",
  /** Interruptor apagado. Informativo, no abre alerta. */
  "Pausado",
  /** Sin token utilizable, o el Historian lo rechaza (401/403). */
  "Sin credencial",
  /** La sonda al Historian falla. */
  "Sin conexión",
  /** Cortacircuito abierto o errores en la ventana. */
  "Con errores",
  "Operativo",
]);
export type EstadoConectorHistorian = z.infer<typeof EstadoConectorHistorianSchema>;

export const TIPO_ALERTA_POR_ESTADO_HISTORIAN: Partial<Record<EstadoConectorHistorian, ITipoAlerta>> = {
  "Sin señal": "Conector Historian sin señal",
  "Sin credencial": "Conector Historian sin credencial",
  "Sin conexión": "Conector Historian sin conexión",
  "Con errores": "Conector Historian con errores",
};

export const EstadoComponenteHistorianSchema = z.object({
  estado: EstadoConectorHistorianSchema,
  desde: z.string(),
  /** Última evaluación (ISO 8601) */
  actualizado: z.string().optional(),
  /** Último heartbeat recibido, tal cual */
  heartbeat: HeartbeatConectorHistorianSchema.optional(),
  /** Recepción del último heartbeat según el reloj de la plataforma (ISO 8601) */
  heartbeatRecibido: z.string().optional(),
  /** Muestras del contador `consultas.errores`, para la ventana de "Con errores" */
  muestrasErrores: z.array(MuestraRechazosSchema).optional(),
  ultimoConErrores: z.string().optional(),
});
export type IEstadoComponenteHistorian = z.infer<typeof EstadoComponenteHistorianSchema>;

export const ComponenteOnPremiseSchema = z.enum(["enlace", "integracionScada", "historian"]);
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
  historian: EstadoComponenteHistorianSchema.optional(),
  /** Últimas transiciones, la más reciente primero (acotado) */
  transiciones: z.array(TransicionOnPremiseSchema).optional(),
  fechaActualizacion: z.string().optional(),
});
export type IEstadoOnPremise = z.infer<typeof EstadoOnPremiseSchema>;
