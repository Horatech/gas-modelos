import { z } from "zod";

/**
 * Historian del SCADA del cliente (Proficy Historian, REST) y serie consolidada de una variable SCADA.
 *
 * Dos contratos:
 * 1. `hist.v1`: plataforma → lector del Historian en la VM del cliente, por el canal NATS
 *    (petición/respuesta, fuera de todo stream). El lector traduce estas consultas a una lista
 *    cerrada de rutas de lectura; la plataforma nunca elige ruta ni parámetros de Proficy.
 * 2. Serie SCADA: lo que devuelve la API de cliente al front, uniendo lo local (registros dentro
 *    del TTL) con lo que viene del Historian.
 *
 * Plan: `gas/PLAN-HISTORIAN-CAMUZZI.md` §2.1 y §8.
 *
 * Archivo hoja: no lo importa ningún otro schema.
 */

// ── Subjects ─────────────────────────────────────────────────────────────────────────────────

/** Valor del header `Esquema` de las consultas y respuestas. */
export const ESQUEMA_HISTORIAN = "hist.v1";

/** Plataforma → VM, petición/respuesta: `ConsultaHistorian` → `RespuestaHistorian`. Sin stream. */
export function subjectConsultaHistorian(inst: string): string {
  return `hist.v1.consulta.${inst}`;
}

// ── Resolución ───────────────────────────────────────────────────────────────────────────────

/**
 * Escalera fija de resoluciones. Fija para que dos gráficos de anchos parecidos reusen los mismos
 * bloques de caché. `2m` es la grilla de archivo del Historian del cliente (intervalo de colección
 * de 120.000 ms medido el 08-oct-2026): se pide crudo. El resto se pide agregado con envolvente.
 */
export const ResolucionHistorianSchema = z.enum(["2m", "5m", "15m", "1h", "1d"]);
export type ResolucionHistorian = z.infer<typeof ResolucionHistorianSchema>;

export const RESOLUCION_HISTORIAN_MS: Record<ResolucionHistorian, number> = {
  "2m": 2 * 60_000,
  "5m": 5 * 60_000,
  "15m": 15 * 60_000,
  "1h": 60 * 60_000,
  "1d": 24 * 60 * 60_000,
};

/** La resolución que se pide cruda (la grilla archivada); las demás llevan promedio, mínimo y máximo. */
export const RESOLUCION_HISTORIAN_CRUDA: ResolucionHistorian = "2m";

/** Calidad de una muestra de Proficy: 0 Bad, 1 Uncertain, 2 NA, 3 Good. */
export const CalidadHistorianSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);
export type CalidadHistorian = z.infer<typeof CalidadHistorianSchema>;

// ── Consulta (plataforma → lector) ───────────────────────────────────────────────────────────

/** Tope de tags por consulta. El lector rechaza más. */
export const MAX_TAGS_CONSULTA_HISTORIAN = 10;

const ConsultaBaseSchema = z.object({
  consultaId: z.string().min(1),
  /** Tags base de iFIX (`scadas.tag`). El lector los traduce al nombre del Historian. */
  tags: z.array(z.string().min(1)).min(1).max(MAX_TAGS_CONSULTA_HISTORIAN),
  /** Pasado este instante (ISO 8601) el lector no la ejecuta. */
  venceTs: z.string(),
});

/** Serie de uno o más tags en `[desde, hasta)`, a una resolución de la escalera. */
export const ConsultaSerieHistorianSchema = ConsultaBaseSchema.extend({
  tipo: z.literal("serie"),
  desde: z.string(),
  hasta: z.string(),
  resolucion: ResolucionHistorianSchema,
});
export type IConsultaSerieHistorian = z.infer<typeof ConsultaSerieHistorianSchema>;

/** Catálogo: cómo nombra el Historian cada tag, su unidad, su intervalo y su primera muestra. */
export const ConsultaCatalogoHistorianSchema = ConsultaBaseSchema.extend({
  tipo: z.literal("catalogo"),
});
export type IConsultaCatalogoHistorian = z.infer<typeof ConsultaCatalogoHistorianSchema>;

export const ConsultaHistorianSchema = z.union([
  ConsultaSerieHistorianSchema,
  ConsultaCatalogoHistorianSchema,
]);
export type IConsultaHistorian = z.infer<typeof ConsultaHistorianSchema>;

// ── Respuesta (lector → plataforma) ──────────────────────────────────────────────────────────

/** Muestra cruda: `[timestamp ISO UTC, valor, calidad]`. `valor` null si Proficy no dio un número. */
export const MuestraCrudaHistorianSchema = z.tuple([z.string(), z.number().nullable(), CalidadHistorianSchema]);
export type MuestraCrudaHistorian = z.infer<typeof MuestraCrudaHistorianSchema>;

/**
 * Intervalo agregado: `[inicio ISO UTC, promedio, mínimo, máximo, calidad]`. La envolvente es
 * obligatoria: bajar resolución no puede esconder un pico (decisión 08-oct-2026).
 */
export const MuestraAgregadaHistorianSchema = z.tuple([
  z.string(),
  z.number().nullable(),
  z.number().nullable(),
  z.number().nullable(),
  CalidadHistorianSchema,
]);
export type MuestraAgregadaHistorian = z.infer<typeof MuestraAgregadaHistorianSchema>;

export const SerieTagHistorianSchema = z.object({
  /** Tag base, el mismo de la consulta. */
  tag: z.string(),
  /** Nombre en el Historian (p. ej. `FIX.<tag>.F_CV`). */
  nombreHistorian: z.string(),
  /** `EngineeringUnits` que declara el Historian. */
  unidad: z.string().optional(),
  muestras: z.union([z.array(MuestraCrudaHistorianSchema), z.array(MuestraAgregadaHistorianSchema)]),
});
export type ISerieTagHistorian = z.infer<typeof SerieTagHistorianSchema>;

export const FichaTagHistorianSchema = z.object({
  tag: z.string(),
  /** Ausente si el Historian no tiene un tag con el nombre esperado. */
  nombreHistorian: z.string().optional(),
  descripcion: z.string().optional(),
  unidad: z.string().optional(),
  colector: z.string().optional(),
  intervaloMs: z.number().int().optional(),
  compresion: z.boolean().optional(),
  /** Timestamp de la primera muestra archivada (retención del tag). */
  primeraMuestra: z.string().optional(),
});
export type IFichaTagHistorian = z.infer<typeof FichaTagHistorianSchema>;

export const MotivoRechazoHistorianSchema = z.enum([
  /** El tag no está entre los declarados del cliente. */
  "TAG_NO_DECLARADO",
  /** Ventana, resolución o cantidad de puntos fuera del presupuesto del lector. */
  "PRESUPUESTO",
  /** Llegó pasado `venceTs`. */
  "VENCIDA",
  /** Interruptor del lector apagado. */
  "APAGADO",
  /** El Historian tiene lecturas en cola o el cortacircuito está abierto. */
  "OCUPADO",
  /** No pasa la validación del schema. */
  "INVALIDA",
]);
export type MotivoRechazoHistorian = z.infer<typeof MotivoRechazoHistorianSchema>;

export const RespuestaHistorianSchema = z.union([
  z.object({
    consultaId: z.string(),
    estado: z.literal("OK"),
    series: z.array(SerieTagHistorianSchema).optional(),
    fichas: z.array(FichaTagHistorianSchema).optional(),
    /** Milisegundos que tardó el Historian (suma de las llamadas). */
    msHistorian: z.number().int().nonnegative(),
  }),
  z.object({
    consultaId: z.string(),
    estado: z.literal("RECHAZADA"),
    motivo: MotivoRechazoHistorianSchema,
    detalle: z.string().optional(),
  }),
  z.object({
    consultaId: z.string(),
    estado: z.literal("ERROR_HISTORIAN"),
    /** `ErrorCode` de Proficy, si vino uno. */
    codigo: z.number().int().optional(),
    /** Estado HTTP, si hubo respuesta. */
    http: z.number().int().optional(),
    detalle: z.string().optional(),
  }),
]);
export type IRespuestaHistorian = z.infer<typeof RespuestaHistorianSchema>;

// ── Serie SCADA consolidada (API de cliente → front) ─────────────────────────────────────────

/** Tope por defecto de puntos de una serie (el límite actual del gráfico SCADA). */
export const MAX_PUNTOS_SERIE_SCADA = 10_000;

export const PedidoSerieScadaSchema = z.object({
  desde: z.string(),
  hasta: z.string(),
  /** Contexto de punto: la serie empieza en la fecha de asignación de la variable al punto. */
  idPuntoMedicion: z.string().optional(),
  maxPuntos: z.coerce.number().int().positive().max(MAX_PUNTOS_SERIE_SCADA).optional(),
});
export type IPedidoSerieScada = z.infer<typeof PedidoSerieScadaSchema>;

/** `[timestamp ISO UTC, valor]` en lo crudo; `[inicio, promedio, mínimo, máximo]` en lo agregado. */
export const PuntoSerieScadaSchema = z.union([
  z.tuple([z.string(), z.number()]),
  z.tuple([z.string(), z.number(), z.number(), z.number()]),
]);
export type PuntoSerieScada = z.infer<typeof PuntoSerieScadaSchema>;

export const FuenteTramoSerieSchema = z.enum(["local", "historian"]);
export type FuenteTramoSerie = z.infer<typeof FuenteTramoSerieSchema>;

export const EstadoTramoSerieSchema = z.enum([
  "ok",
  /** El Historian no respondió a tiempo, está ocupado o devolvió error. */
  "no-disponible",
  /** La variable no tiene equivalente en el Historian, o su unidad no coincide. */
  "sin-mapeo",
]);
export type EstadoTramoSerie = z.infer<typeof EstadoTramoSerieSchema>;

export const TramoSerieScadaSchema = z.object({
  fuente: FuenteTramoSerieSchema,
  desde: z.string(),
  hasta: z.string(),
  /** `cambio`: registros locales tal como llegaron (un dato por cambio de valor). */
  resolucion: z.union([z.literal("cambio"), ResolucionHistorianSchema]),
  estado: EstadoTramoSerieSchema,
  motivo: z.string().optional(),
});
export type ITramoSerieScada = z.infer<typeof TramoSerieScadaSchema>;

export const SerieScadaSchema = z.object({
  /** En orden ascendente de tiempo. */
  puntos: z.array(PuntoSerieScadaSchema),
  tramos: z.array(TramoSerieScadaSchema),
  /** La serie llegó al tope de puntos. */
  truncado: z.boolean(),
});
export type ISerieScada = z.infer<typeof SerieScadaSchema>;
