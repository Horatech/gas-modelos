import { z } from "zod";
import { EstadoCorrectoraSchema } from "./estado";
import { MAX_SERIES_GRAFICO } from "./grafico-personalizado";
import { parseCanalRef } from "./perfil-lectura";
import { DivisionSchema } from "../tenant/usuario/permiso";

/**
 * Bloques del chat del asistente: lo que el sistema dibuja entre el texto del agente (un valor, una serie, una tabla
 * de registros, un seguimiento, una lista de puntos). Un bloque es una especificación declarativa: dice qué mostrar,
 * no trae valores. Lo devuelve una tool del MCP y lo dibuja el front, que pide los datos con el token del usuario.
 *
 * El texto de la respuesta lo referencia con el marcador `{{bloque:<id>}}`. Refinar un bloque es devolverlo con el
 * mismo `id` y `version` + 1 en una respuesta nueva; la versión anterior queda en su consulta.
 */

export const MAX_CANALES_BLOQUE = 20;
/** Puntos de una lista o de un mapa armados por la herramienta (una búsqueda, los cercanos a uno). */
export const MAX_PUNTOS_BLOQUE = 200;

const CanalRefSchema = z.string().refine((c) => parseCanalRef(c) !== null, { message: "canal inválido" });

const fechaValida = (f: string) => Number.isFinite(Date.parse(f));
const FechaSchema = z.string().refine(fechaValida, { message: "fecha inválida" });

function zonaHorariaValida(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

const BloqueBaseSchema = z.object({
  /** Corto y único en la conversación. Lo genera el MCP, salvo al refinar (se reusa el del bloque refinado). */
  id: z.string().trim().min(1).max(64),
  titulo: z.string().trim().min(1),
  /** Empieza en 1 y sube en cada refinamiento del mismo `id`. */
  version: z.number().int().positive(),
});

/** El último valor de uno o más canales de un punto. */
export const BloqueValorSchema = BloqueBaseSchema.extend({
  tipo: z.literal("valor"),
  idPunto: z.string().min(1),
  canales: z.array(CanalRefSchema).min(1).max(MAX_CANALES_BLOQUE),
});
export type IBloqueValor = z.infer<typeof BloqueValorSchema>;

/**
 * Series en el tiempo, con los mismos ids que acepta la pantalla Gráficos (`<idScada>`, `<idPunto>.<campo>`,
 * `L.<idLocalidad>.<campo>`). El período es absoluto: la tool convierte "los últimos 7 días" al crear el bloque, así
 * que la conversación reabierta muestra lo mismo. Acepta día (`2026-10-01`) o instante.
 */
export const BloqueSerieSchema = BloqueBaseSchema.extend({
  tipo: z.literal("serie"),
  series: z.array(z.string().min(1)).min(1).max(MAX_SERIES_GRAFICO),
  desde: FechaSchema,
  hasta: FechaSchema,
}).refine((b) => Date.parse(b.desde) <= Date.parse(b.hasta), { message: "hasta no puede ser anterior a desde" });
export type IBloqueSerie = z.infer<typeof BloqueSerieSchema>;

/**
 * Los registros de un punto en una ventana. `desde` y `hasta` son instantes UTC; `zonaHoraria` (IANA) es la del
 * usuario y sirve para mostrar las horas como las pidió. Cada registro rotula el cierre de su intervalo: el de las
 * 16:00 es lo que pasó de 15 a 16 (ver `IRegistro.tsCorrido`).
 */
export const BloqueRegistrosSchema = BloqueBaseSchema.extend({
  tipo: z.literal("registros"),
  idPunto: z.string().min(1),
  canales: z.array(CanalRefSchema).min(1).max(MAX_CANALES_BLOQUE),
  desde: FechaSchema,
  hasta: FechaSchema,
  zonaHoraria: z.string().refine(zonaHorariaValida, { message: "zona horaria inválida" }),
}).refine((b) => Date.parse(b.desde) < Date.parse(b.hasta), { message: "desde debe ser anterior a hasta" });
export type IBloqueRegistros = z.infer<typeof BloqueRegistrosSchema>;

/**
 * Cómo se sigue un punto. Lo decide el backend según el equipo y su estado, no el modelo:
 * - `vivo`: el valor se actualiza solo mientras el bloque está activo (SCADA; NSP/Veribox en alerta de margen).
 * - `ultimoReporte`: el último reporte, con su antigüedad (NSP/Veribox sin alerta).
 * - `ultimoEnvio`: el último envío del equipo (NUC). Nunca en vivo.
 */
export const ModoSeguimientoSchema = z.enum(["vivo", "ultimoReporte", "ultimoEnvio"]);
export type ModoSeguimiento = z.infer<typeof ModoSeguimientoSchema>;

export const BloqueSeguimientoSchema = BloqueBaseSchema.extend({
  tipo: z.literal("seguimiento"),
  idPunto: z.string().min(1),
  /** Ausente: los canales principales del punto. */
  canal: CanalRefSchema.optional(),
  modo: ModoSeguimientoSchema,
  /** Cada cuánto se espera un dato nuevo. Con él, el front marca el bloque como desactualizado. */
  cadenciaEsperadaMin: z.number().positive(),
});
export type IBloqueSeguimiento = z.infer<typeof BloqueSeguimientoSchema>;

/**
 * Filtro de la lista de puntos. Cada campo ausente no filtra; los presentes se combinan. `idsPunto`: una lista que el
 * filtro no expresa (el resultado de una búsqueda por texto, los puntos de unas alertas); los permisos los aplica la
 * API igual.
 */
export const FiltroBloquePuntosSchema = z.object({
  idsPunto: z.array(z.string().min(1)).min(1).max(MAX_PUNTOS_BLOQUE).optional(),
  estados: z.array(EstadoCorrectoraSchema).min(1).optional(),
  idsUnidadNegocio: z.array(z.string().min(1)).min(1).optional(),
  idsCentroOperativo: z.array(z.string().min(1)).min(1).optional(),
  divisiones: z.array(DivisionSchema).min(1).optional(),
});
export type IFiltroBloquePuntos = z.infer<typeof FiltroBloquePuntosSchema>;

export const BloquePuntosSchema = BloqueBaseSchema.extend({
  tipo: z.literal("puntos"),
  filtro: FiltroBloquePuntosSchema,
  /** Campo del punto; con `-` adelante, descendente. Ausente: el orden del listado. */
  orden: z.string().min(1).optional(),
});
export type IBloquePuntos = z.infer<typeof BloquePuntosSchema>;

/**
 * Puntos en el mapa. La herramienta resuelve cuáles (una búsqueda, los cercanos a uno) y el bloque los guarda por id,
 * así la conversación reabierta muestra los mismos. `centro`: el punto de referencia (el de "cerca de"), resaltado;
 * con `radioKm`, el círculo de la búsqueda.
 */
export const BloqueMapaSchema = BloqueBaseSchema.extend({
  tipo: z.literal("mapa"),
  idsPunto: z.array(z.string().min(1)).min(1).max(MAX_PUNTOS_BLOQUE),
  centro: z.string().min(1).optional(),
  radioKm: z.number().positive().optional(),
});
export type IBloqueMapa = z.infer<typeof BloqueMapaSchema>;

export const BloqueAsistenteSchema = z.discriminatedUnion("tipo", [
  BloqueValorSchema,
  BloqueSerieSchema,
  BloqueRegistrosSchema,
  BloqueSeguimientoSchema,
  BloquePuntosSchema,
  BloqueMapaSchema,
]);
export type IBloqueAsistente = z.infer<typeof BloqueAsistenteSchema>;
export type TipoBloqueAsistente = IBloqueAsistente["tipo"];

export const TIPOS_BLOQUE_ASISTENTE: TipoBloqueAsistente[] = [
  "valor",
  "serie",
  "registros",
  "seguimiento",
  "puntos",
  "mapa",
];

/** Marcador con el que el texto de la respuesta ubica un bloque. */
export const marcadorBloque = (id: string) => `{{bloque:${id}}}`;
/** Encuentra los marcadores de un texto; el grupo 1 es el id. Global: crear uno nuevo por uso o reiniciar `lastIndex`. */
export const regexMarcadorBloque = () => /\{\{bloque:([^{}\s]+)\}\}/g;

/** Los bloques de una respuesta: sin dos con el mismo `id`. */
export const BloquesRespuestaSchema = z
  .array(BloqueAsistenteSchema)
  .refine((bs) => new Set(bs.map((b) => b.id)).size === bs.length, { message: "id de bloque repetido" });
