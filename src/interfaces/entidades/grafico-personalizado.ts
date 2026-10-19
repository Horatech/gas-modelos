import { z } from "zod";
import { parseCanalRef } from "./perfil-lectura";
import { CorteDiarioSchema } from "./serie-punto";
import { AmbitoClimaSchema } from "./serie-clima";

/**
 * Gráfico personalizado (P56): preset por usuario del trend de series. Cada serie por `canalRef`
 * (SCADA: `canalScada(tag)`; clima: canal + `ambito`; otras familias: canal + `idPunto`).
 * Spec: gas-insideht-doc docs/superpowers/specs/2026-10-09-grafico-personalizado-design.md
 */

export const MAX_SERIES_GRAFICO = 20;

export const DuracionGraficoSchema = z.enum(["1M", "5M", "30M", "1H", "2H", "4H", "8H", "24H", "1W", "30D", "90D", "1A"]);
export type DuracionGrafico = z.infer<typeof DuracionGraficoSchema>;

const MIN = 60_000;
const DIA = 1440 * MIN;
export const DURACION_GRAFICO_MS: Record<DuracionGrafico, number> = {
  "1M": MIN,
  "5M": 5 * MIN,
  "30M": 30 * MIN,
  "1H": 60 * MIN,
  "2H": 120 * MIN,
  "4H": 240 * MIN,
  "8H": 480 * MIN,
  "24H": DIA,
  "1W": 7 * DIA,
  "30D": 30 * DIA,
  "90D": 90 * DIA,
  "1A": 365 * DIA,
};
/** Sólo con todas las series SCADA en el historiador: lo local SCADA cubre 30 días. Las series que no son SCADA no tienen TTL. */
export const DURACIONES_SOLO_HISTORIAN: DuracionGrafico[] = ["90D", "1A"];

/**
 * Escala del eje de una serie. Ausente (o vacía) = automática: se ajusta a los datos. `margenes`: se ajusta a los datos
 * y a los márgenes de la variable (HH/H/L/LL; mínimo y máximo de presión). `min` y/o `max`: extremos fijos. `margenes`
 * no va con extremos fijos. La serie con escala propia va en su propio eje aunque comparta unidad con otras.
 */
export const EscalaSerieSchema = z
  .object({
    min: z.number().optional(),
    max: z.number().optional(),
    margenes: z.boolean().optional(),
  })
  .refine((e) => e.min === undefined || e.max === undefined || e.min < e.max, {
    message: "min debe ser menor que max",
  })
  .refine((e) => !e.margenes || (e.min === undefined && e.max === undefined), {
    message: "la escala a los márgenes no lleva extremos fijos",
  });
export type IEscalaSerie = z.infer<typeof EscalaSerieSchema>;

export const SeriePresetSchema = z.object({
  canal: z.string().refine((c) => parseCanalRef(c) !== null, { message: "canal inválido" }),
  /** Sólo en canales que no identifican la instancia (no SCADA ni clima). */
  idPunto: z.string().optional(),
  /** Sólo en canales de clima: la Localidad o el Centro Operativo. */
  ambito: AmbitoClimaSchema.optional(),
  visible: z.boolean(),
  escala: EscalaSerieSchema.optional(),
});
export type ISeriePreset = z.infer<typeof SeriePresetSchema>;

export const GraficoPersonalizadoSchema = z.object({
  _id: z.string().optional(),
  idUsuario: z.string(),
  idCliente: z.string(),
  nombre: z.string().trim().min(1).max(100),
  modo: z.enum(["vivo", "historico"]),
  duracion: DuracionGraficoSchema.optional(),
  rango: z.object({ desde: z.string(), hasta: z.string() }).optional(),
  vista: z.enum(["unico", "apilado"]),
  nombreMostrado: z.enum(["tag", "descripcion", "ambos"]),
  /**
   * `configurada` = el mínimo y máximo de la variable SCADA, para todo el gráfico. Lo reemplaza `escala` de cada serie:
   * el front traduce un preset `configurada` a escala por serie al abrirlo y guarda `auto`.
   */
  escala: z.enum(["auto", "configurada"]),
  /** Límites de las variables (HH/H/L/LL de SCADA; mínimo y máximo de la unidad de presión). Ausente = se muestran. */
  margenes: z.boolean().optional(),
  /** Dónde corta el día en los baldes diarios. Ausente = día gas. */
  corteDiario: CorteDiarioSchema.optional(),
  series: z.array(SeriePresetSchema).max(MAX_SERIES_GRAFICO),
  fechaCreacion: z.string().optional(),
  fechaActualizacion: z.string().optional(),
});
export type IGraficoPersonalizado = z.infer<typeof GraficoPersonalizadoSchema>;

function ventanaValida(g: { modo?: string; duracion?: unknown; rango?: unknown }): boolean {
  if (g.modo === "vivo") return !!g.duracion && !g.rango;
  return !!g.duracion !== !!g.rango;
}

export const CreateGraficoPersonalizadoSchema = GraficoPersonalizadoSchema.omit({
  _id: true,
  fechaCreacion: true,
  fechaActualizacion: true,
}).refine(ventanaValida, { message: "Vivo lleva duración; histórico, duración o rango" });
export type ICreateGraficoPersonalizado = z.infer<typeof CreateGraficoPersonalizadoSchema>;

export const UpdateGraficoPersonalizadoSchema = GraficoPersonalizadoSchema.omit({
  _id: true,
  idUsuario: true,
  idCliente: true,
  fechaCreacion: true,
  fechaActualizacion: true,
}).partial();
export type IUpdateGraficoPersonalizado = z.infer<typeof UpdateGraficoPersonalizadoSchema>;
