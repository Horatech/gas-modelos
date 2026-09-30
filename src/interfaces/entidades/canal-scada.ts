import { z } from "zod";
import { ReporteScadaSchema } from "./valores-reporte/scada";

/**
 * Canal SCADA por el túnel: mensajes entre el adaptador OPC-UA on-premise y la plataforma, sobre
 * NATS (leaf en la VM del cliente, hub en el cluster). v1 viaja en JSON con estos schemas.
 *
 * La frontera entre clientes es el account de NATS: ni los subjects ni los payloads llevan
 * `idCliente` ni `apikey`. `inst` identifica la instancia del adaptador dentro del account.
 *
 * Plan: `gas/PLAN-SCADA-POR-TUNEL.md` §2.
 *
 * Archivo hoja: no lo importa ningún otro schema.
 */

// ── Subjects, streams y claves ───────────────────────────────────────────────────────────────

/** Valor del header `Esquema` de todo mensaje publicado por la VM. */
export const ESQUEMA_CANAL_SCADA = "scada.v1";

/**
 * Subjects del canal para una instancia. Ninguno de petición/respuesta (`cfg`, `cmd`) puede quedar
 * capturado por un stream: los streams usan sólo `STREAM_SUBJECTS_CANAL_SCADA`.
 */
export function subjectsCanalScada(inst: string) {
  return {
    /** VM → plataforma. `LoteTelemetria`. En stream. */
    telemetria: `scada.v1.tel.${inst}`,
    /** VM → plataforma. `IRechazoLimiteScada`. En stream. */
    rechazo: `scada.v1.evt.${inst}.rechazo`,
    /** VM → plataforma. `LimitesLeidosScada`. En stream. */
    limites: `scada.v1.evt.${inst}.limites`,
    /** VM → plataforma. `ResultadoComandoScada`. En stream. */
    resultadoComando: `scada.v1.evt.${inst}.comando`,
    /** VM → plataforma. `IHeartbeatIntegracionScada` cada 60 s. Core NATS, sin stream. */
    estado: `scada.v1.estado.${inst}`,
    /** VM → plataforma, petición/respuesta: `PedidoTagsScada` → `ListaTagsScada`. */
    tags: `scada.v1.cfg.${inst}.tags`,
    /** Plataforma → VM, petición/respuesta: `ComandoEscribirLimite` → `AceptacionComandoScada`. */
    escribir: `scada.v1.cmd.${inst}.escribir`,
    /** Plataforma → VM, petición/respuesta: `ComandoLeerLimites` → `AceptacionComandoScada`. */
    leer: `scada.v1.cmd.${inst}.leer`,
  };
}

/** Subjects del stream del borde (y, por `sources`, del hub). Sólo telemetría y eventos. */
export const STREAM_SUBJECTS_CANAL_SCADA = ["scada.v1.tel.>", "scada.v1.evt.>"] as const;

/** Stream del leaf (disco de la VM). */
export const STREAM_BORDE_SCADA = "SCADA_EDGE";
/** Stream del hub, alimentado por `sources` desde el borde. */
export const STREAM_HUB_SCADA = "SCADA";
/** KV del dominio del leaf: el adaptador lo lee al arrancar aunque no haya túnel. */
export const KV_CONFIG_CANAL_SCADA = "SCADA_CFG";

/** Qué salida de telemetría usa el adaptador. Clave `canal.telemetria` del KV. */
export const SalidaTelemetriaScadaSchema = z.enum(["http", "ambos", "nats"]);
export type SalidaTelemetriaScada = z.infer<typeof SalidaTelemetriaScadaSchema>;

/** Si el adaptador sigue suscripto a los comandos por MQTT. Clave `canal.comandos_mqtt` del KV. */
export const ComandosMqttScadaSchema = z.enum(["on", "off"]);
export type ComandosMqttScada = z.infer<typeof ComandosMqttScadaSchema>;

export const CLAVES_KV_CANAL_SCADA = {
  telemetria: "canal.telemetria",
  comandosMqtt: "canal.comandos_mqtt",
} as const;

/**
 * Header `Nats-Msg-Id` de un mensaje de la VM: `<inst>:<arranqueId>:<seq>`. El stream del borde y
 * el del hub descartan un id repetido dentro de su `duplicate_window` (explícita: en un stream con
 * `sources` la ventana por defecto está apagada).
 */
export function natsMsgIdCanalScada(inst: string, arranqueId: string, seq: number): string {
  return `${inst}:${arranqueId}:${seq}`;
}

// ── Telemetría ───────────────────────────────────────────────────────────────────────────────

/**
 * Una muestra: el mismo objeto que hoy recibe `POST /reportesOPC`, sin `idCliente` (lo da el
 * account). `calidad` y `tsServidor` viajan, pero hasta que se decida guardarlos el consumidor los
 * quita antes de persistir (hoy `reporteOPC` guarda el objeto entero en `valores`).
 *
 * Los cuatro límites de un tag llegan de iFix con el mismo `sourceTimestamp`; una muestra puede
 * llevar varios `limite*` a la vez.
 */
export const MuestraScadaSchema = ReporteScadaSchema.extend({
  tag: z.string(),
  /** StatusCode OPC-UA crudo del DataValue. */
  calidad: z.number().int().optional(),
  /** `serverTimestamp` del DataValue (ISO 8601). */
  tsServidor: z.string().optional(),
});
export type IMuestraScada = z.infer<typeof MuestraScadaSchema>;

/** Qué camino vale para un lote (conmutación HTTP ↔ NATS sin duplicar efectos). */
export const AutoritativoScadaSchema = z.enum(["nats", "http"]);
export type AutoritativoScada = z.infer<typeof AutoritativoScadaSchema>;

/**
 * Por qué se armó el lote. Lo marca el adaptador según su propio estado: iFix sella los valores
 * iniciales de una suscripción con la hora de creación, así que un `timestamp` viejo no sirve para
 * reconocer una re-suscripción.
 */
export const MotivoLoteScadaSchema = z.enum(["REGIMEN", "RESUSCRIPCION", "RELECTURA"]);
export type MotivoLoteScada = z.infer<typeof MotivoLoteScadaSchema>;

/** Tope de muestras por lote (el lote también cierra por tiempo, ≤ 1 s). */
export const MAX_MUESTRAS_LOTE_SCADA = 200;

export const LoteTelemetriaSchema = z.object({
  inst: z.string(),
  /** Identificador del arranque del adaptador; con `seq` forma el `Nats-Msg-Id`. */
  arranqueId: z.string(),
  /** Monótono por arranque. */
  seq: z.number().int().nonnegative(),
  /** Reloj del adaptador al cerrar el lote (ISO 8601). */
  armadoTs: z.string(),
  autoritativo: AutoritativoScadaSchema,
  motivo: MotivoLoteScadaSchema,
  muestras: z.array(MuestraScadaSchema).min(1).max(MAX_MUESTRAS_LOTE_SCADA),
});
export type ILoteTelemetria = z.infer<typeof LoteTelemetriaSchema>;

// ── Huella por minuto (sombra) ───────────────────────────────────────────────────────────────

/**
 * Huella de lo que pasó por un camino en un minuto: cantidad de muestras y XOR de la firma de cada
 * una. Durante la sombra los mismos datos viajan por HTTP y por el canal; si la huella de un minuto
 * coincide en las dos puntas, ese minuto viajó idéntico (sin pérdidas, duplicados ni cambios).
 *
 * El minuto es el del `timestamp` de la muestra (hora de iFix), no el de envío ni el de llegada, así
 * que no depende del atraso del canal. Suma y XOR son conmutativos: las huellas parciales de un mismo
 * minuto emitidas en momentos distintos (lo que llega tarde después de un corte) se combinan en
 * cualquier orden con `combinarHuellasScada`.
 */
export const OrigenHuellaScadaSchema = z.enum([
  /** Muestras que el camino HTTP aceptó (2xx). */
  "adaptador-http",
  /** Muestras de lotes que el leaf confirmó (PubAck). */
  "adaptador-canal",
  /** Muestras de lotes que el consumidor recibió del hub (primera entrega). */
  "consumidor",
]);
export type OrigenHuellaScada = z.infer<typeof OrigenHuellaScadaSchema>;

export const HuellaMinutoScadaSchema = z.object({
  /** Cantidad de muestras. */
  n: z.number().int().nonnegative(),
  /** XOR de las firmas, 16 dígitos hexadecimales. */
  x: z.string().regex(/^[0-9a-f]{16}$/),
});
export type IHuellaMinutoScada = z.infer<typeof HuellaMinutoScadaSchema>;

/** Lo que una punta acumuló desde su emisión anterior. Se loguea como `[HUELLA] <json>`. */
export const HuellaParcialScadaSchema = z.object({
  origen: OrigenHuellaScadaSchema,
  inst: z.string(),
  /** ISO 8601, reloj de quien emite. */
  emitidoTs: z.string(),
  /** Clave: minuto `YYYY-MM-DDTHH:MMZ` (ver `minutoHuellaScada`). */
  minutos: z.record(z.string(), HuellaMinutoScadaSchema),
});
export type IHuellaParcialScada = z.infer<typeof HuellaParcialScadaSchema>;

/** Campos de una muestra que entran en su firma (lo que se persiste de ella). */
type MuestraFirmable = Pick<IMuestraScada, "tag" | "timestamp" | "valorActual" | "limiteHH" | "limiteH" | "limiteL" | "limiteLL">;

const FNV64_OFFSET = BigInt("0xcbf29ce484222325");
const FNV64_PRIME = BigInt("0x100000001b3");
const MASK64 = BigInt("0xffffffffffffffff");

/**
 * Texto de un valor igual antes y después de pasar por JSON: `undefined` y una clave ausente dan
 * lo mismo; `null` se distingue; un número no finito vale lo que JSON hace con él (`null`).
 */
function textoFirma(v: unknown): string {
  if (v === undefined) return "";
  if (v === null) return "null";
  if (typeof v === "number" && !Number.isFinite(v)) return "null";
  return String(v);
}

/** Firma de 64 bits (FNV-1a sobre las unidades UTF-16) de los campos persistidos de una muestra. */
export function firmaMuestraScada(m: MuestraFirmable): bigint {
  const texto = [m.tag, m.timestamp, m.valorActual, m.limiteHH, m.limiteH, m.limiteL, m.limiteLL]
    .map(textoFirma)
    .join("|");
  let h = FNV64_OFFSET;
  for (let i = 0; i < texto.length; i++) {
    h ^= BigInt(texto.charCodeAt(i));
    h = (h * FNV64_PRIME) & MASK64;
  }
  return h;
}

/** Minuto de la muestra (`YYYY-MM-DDTHH:MMZ`, UTC) o `sin-hora` si el `timestamp` falta o no es fecha. */
export function minutoHuellaScada(timestamp: string | undefined): string {
  const d = timestamp ? new Date(timestamp) : undefined;
  if (!d || Number.isNaN(d.getTime())) return "sin-hora";
  return `${d.toISOString().slice(0, 16)}Z`;
}

const hex64 = (x: bigint) => x.toString(16).padStart(16, "0");

/** Acumula huellas por minuto entre emisiones. */
export class AcumuladorHuellasScada {
  private minutos = new Map<string, { n: number; x: bigint }>();

  agregar(m: MuestraFirmable): void {
    const clave = minutoHuellaScada(m.timestamp);
    const actual = this.minutos.get(clave) ?? { n: 0, x: BigInt(0) };
    actual.n++;
    actual.x ^= firmaMuestraScada(m);
    this.minutos.set(clave, actual);
  }

  get vacio(): boolean {
    return this.minutos.size === 0;
  }

  /** Lo acumulado desde la extracción anterior; el acumulador queda vacío. */
  extraer(): Record<string, IHuellaMinutoScada> {
    const out: Record<string, IHuellaMinutoScada> = {};
    for (const [k, v] of [...this.minutos.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      out[k] = { n: v.n, x: hex64(v.x) };
    }
    this.minutos.clear();
    return out;
  }
}

/** Combina huellas parciales del mismo origen (suma de `n`, XOR de `x`, por minuto). */
export function combinarHuellasScada(
  parciales: Record<string, IHuellaMinutoScada>[],
): Record<string, IHuellaMinutoScada> {
  const acc = new Map<string, { n: number; x: bigint }>();
  for (const p of parciales) {
    for (const [k, v] of Object.entries(p)) {
      const a = acc.get(k) ?? { n: 0, x: BigInt(0) };
      a.n += v.n;
      a.x ^= BigInt(`0x${v.x}`);
      acc.set(k, a);
    }
  }
  const out: Record<string, IHuellaMinutoScada> = {};
  for (const [k, v] of [...acc.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    out[k] = { n: v.n, x: hex64(v.x) };
  }
  return out;
}

// ── Comandos (petición/respuesta en dos tiempos) ─────────────────────────────────────────────

/**
 * Límite de alarma como propiedad del tag en iFix. El canal acepta sólo límites; la escritura del
 * valor actual queda fuera de este contrato.
 */
export const PropiedadLimiteScadaSchema = z.enum(["E_HI", "E_HIHI", "E_LO", "E_LOLO"]);
export type PropiedadLimiteScada = z.infer<typeof PropiedadLimiteScadaSchema>;

export const OrigenComandoScadaSchema = z.enum(["RECONCILIACION", "USUARIO"]);
export type OrigenComandoScada = z.infer<typeof OrigenComandoScadaSchema>;

export const ComandoEscribirLimiteSchema = z.object({
  comandoId: z.string(),
  tag: z.string(),
  propiedad: PropiedadLimiteScadaSchema,
  valor: z.number(),
  /** ISO 8601. */
  emitidoTs: z.string(),
  /** ISO 8601. Pasado este momento el adaptador no lo aplica (`VENCIDO`). */
  venceTs: z.string(),
  origen: OrigenComandoScadaSchema,
});
export type IComandoEscribirLimite = z.infer<typeof ComandoEscribirLimiteSchema>;

export const ComandoLeerLimitesSchema = z.object({
  comandoId: z.string(),
  tag: z.string(),
  /** ISO 8601. */
  venceTs: z.string(),
});
export type IComandoLeerLimites = z.infer<typeof ComandoLeerLimitesSchema>;

/** Respuesta inmediata a un comando: confirma la aceptación, no el resultado. */
export const EstadoAceptacionScadaSchema = z.enum([
  "ENCOLADO",
  "DUPLICADO",
  "VENCIDO",
  "SIN_SESION",
  "TAG_NO_VIGENTE",
]);
export type EstadoAceptacionScada = z.infer<typeof EstadoAceptacionScadaSchema>;

export const AceptacionComandoScadaSchema = z.object({
  comandoId: z.string(),
  estado: EstadoAceptacionScadaSchema,
});
export type IAceptacionComandoScada = z.infer<typeof AceptacionComandoScadaSchema>;

/** Resultado final de un comando, como evento en stream (`resultadoComando`), por `comandoId`. */
export const ResultadoComandoScadaSchema = z.object({
  comandoId: z.string(),
  resultado: z.enum(["APLICADO", "RECHAZO_CONFIGURACION", "ERROR_OPC"]),
  /** StatusCode OPC-UA de la operación, si la hubo. */
  statusCode: z.number().int().optional(),
  /** Valor releído después de escribir. */
  valorLeido: z.number().optional(),
  /** ISO 8601. */
  fecha: z.string(),
});
export type IResultadoComandoScada = z.infer<typeof ResultadoComandoScadaSchema>;

/** Límites leídos del SCADA (respuesta de `ComandoLeerLimites`, como evento en stream). */
export const LimitesLeidosScadaSchema = z.object({
  comandoId: z.string(),
  tag: z.string(),
  limiteHH: z.number().optional(),
  limiteH: z.number().optional(),
  limiteL: z.number().optional(),
  limiteLL: z.number().optional(),
  /** ISO 8601, reloj del adaptador. */
  fecha: z.string(),
});
export type ILimitesLeidosScada = z.infer<typeof LimitesLeidosScadaSchema>;

// ── Configuración ────────────────────────────────────────────────────────────────────────────

export const PedidoTagsScadaSchema = z.object({
  /** `version` de la última lista recibida: si no cambió, la respuesta no trae los tags. */
  versionConocida: z.string().optional(),
});
export type IPedidoTagsScada = z.infer<typeof PedidoTagsScadaSchema>;

export const TagSuscriptoScadaSchema = z.object({
  tag: z.string(),
  type: z.enum(["boolean", "number"]),
});
export type ITagSuscriptoScada = z.infer<typeof TagSuscriptoScadaSchema>;

export const ListaTagsScadaSchema = z.object({
  version: z.string(),
  sinCambios: z.boolean(),
  tags: z.array(TagSuscriptoScadaSchema),
});
export type IListaTagsScada = z.infer<typeof ListaTagsScadaSchema>;

// ── Comandos por MQTT (camino actual, convive hasta F8) ──────────────────────────────────────

/**
 * Tipo de valor en los comandos MQTT `…/scadas/escribir/limites`. El adaptador nombra `CV` al
 * valor actual; gas-api-integraciones y gas-api-cliente lo nombran `Valor Actual`.
 */
export const OPCTypeSchema = z.enum(["Alto", "Muy Alto", "Bajo", "Muy Bajo", "CV", "Valor Actual"]);
export type OPCType = z.infer<typeof OPCTypeSchema>;

/** Payload de `…/scadas/escribir/limites` (hoy duplicado como `OPCData` en tres repos). */
export const OPCDataSchema = z.object({
  apikey: z.string(),
  tag: z.string(),
  type: OPCTypeSchema,
  value: z.number(),
});
export type IOPCData = z.infer<typeof OPCDataSchema>;
