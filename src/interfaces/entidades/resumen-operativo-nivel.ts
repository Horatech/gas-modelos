import { z } from "zod";
import { TipoDatoClimaSchema } from "./registro-clima";

/**
 * DTO de respuesta de las vistas RESUMEN por nivel jerarquico (INSIDEht 2.0).
 * Lo produce gas-api-cliente (a partir del rollup diario resumendiariolocalidad
 * + la serie de clima) y lo consume gas-web-cliente. No es una entidad.
 */

export const NivelResumenSchema = z.enum([
  "UnidadNegocio",
  "CentroOperativo",
  "Localidad",
]);
export type NivelResumen = z.infer<typeof NivelResumenSchema>;

/** Punto de la serie diaria: consumo + temperatura (tendencia + correlacion). */
export const PuntoSerieResumenSchema = z.object({
  fecha: z.string(), // inicio del dia gas
  // Consumo TOTALIZADO del dia (suma de todos los medidores del nivel).
  volumenGasTotal: z.number().optional(),
  volumenCorregidoCorrectoras: z.number().optional(),
  consumoResidencial: z.number().optional(),
  // Consumo PROMEDIO por medidor del dia (= total / cantidad de medidores del nivel).
  // Independiente de la cantidad de medidores instalados: refleja la relacion
  // temperatura <-> consumo sin distorsionarse al agregar/quitar medidores.
  consumoResidencialPromedio: z.number().optional(),
  consumoCorrectorasPromedio: z.number().optional(),
  temperaturaMedia: z.number().optional(),
  temperaturaMin: z.number().optional(),
  temperaturaMax: z.number().optional(),
  sensacionTermicaMedia: z.number().optional(),
  // Horas del dia con dato climatico (24 = dia completo). Deja ver si un punto
  // de la correlacion se apoya en una media horaria completa o en pocas muestras.
  horasClima: z.number().optional(),
});
export type IPuntoSerieResumen = z.infer<typeof PuntoSerieResumenSchema>;

/** Clima agregado al nivel (actual o un punto de pronostico). Unidades canonicas. */
export const ClimaResumenSchema = z.object({
  fecha: z.string().optional(),
  tipo: TipoDatoClimaSchema.optional(),
  temperatura: z.number().optional(), // °C
  temperaturaMin: z.number().optional(),
  temperaturaMax: z.number().optional(),
  sensacionTermica: z.number().optional(), // °C
  vientoVelocidad: z.number().optional(), // m/s
  radiacion: z.number().optional(), // W/m2
  humedad: z.number().optional(), // %
});
export type IClimaResumen = z.infer<typeof ClimaResumenSchema>;

export const ResumenOperativoNivelSchema = z.object({
  nivel: NivelResumenSchema,
  id: z.string(),
  desde: z.string().optional(),
  hasta: z.string().optional(),

  // Consumo agregado del periodo (suma de las filas de rollup del nivel)
  volumenGasTotal: z.number().optional(),
  volumenBaseCorrectoras: z.number().optional(),
  volumenCorregidoCorrectoras: z.number().optional(),
  consumoResidencial: z.number().optional(),
  cantidadCorrectoras: z.number().optional(),
  cantidadMedidoresResidenciales: z.number().optional(),
  cantidadLocalidades: z.number().optional(), // localidades con dato en el periodo

  // Serie diaria (consumo + temperatura) para tendencia y correlacion clima-demanda
  serie: z.array(PuntoSerieResumenSchema).optional(),

  // Clima
  climaActual: ClimaResumenSchema.optional(), // punto horario mas cercano a ahora, promediado al nivel
  pronostico: z.array(ClimaResumenSchema).optional(), // PRONOSTICO a futuro (>=1 semana), por dia
});
export type IResumenOperativoNivel = z.infer<
  typeof ResumenOperativoNivelSchema
>;

/** Direccion de la tendencia de temperatura del pronostico. */
export const DireccionTendenciaSchema = z.enum(["sube", "baja", "estable"]);
export type DireccionTendencia = z.infer<typeof DireccionTendenciaSchema>;

export const TendenciaResumenSchema = z.object({
  direccion: DireccionTendenciaSchema,
  delta: z.number(), // °C entre el inicio y el fin del pronostico
});
export type ITendenciaResumen = z.infer<typeof TendenciaResumenSchema>;

export const PuntoTemperaturaResumenSchema = z.object({
  fecha: z.string(), // ISO (dia)
  temperatura: z.number().optional(), // °C
});
export type IPuntoTemperaturaResumen = z.infer<
  typeof PuntoTemperaturaResumenSchema
>;

/**
 * Tarjeta CLIMATICA de un hijo del nivel actual (una UN / CO / Localidad de la
 * grilla de drill-down de la vista Resumen).
 *
 * Existe para que la grilla se pinte con **un solo pedido**. Antes el frontend
 * llamaba `GET /resumen/:nivel/:id` una vez POR TARJETA: cada una de esas
 * llamadas dispara 4 consultas a gas-datos (localidades + rollups + clima
 * horario + pronostico) y devuelve `serie[30]` + `pronostico[8]` completos, de
 * los que la tarjeta usaba 6 valores. Con N hijos era N veces todo el pipeline.
 *
 * Es deliberadamente SOLO CLIMA: el consumo y los conteos de parque no van en la
 * tarjeta, y traerlos obligaria a leer los rollups de consumo de todos los hijos.
 * `serieTemperatura` si sale del rollup diario, pero pidiendo unicamente
 * `fecha` + temperatura (payload chico).
 */
export const ResumenClimaHijoSchema = z.object({
  nivel: NivelResumenSchema,
  id: z.string(),

  climaActual: ClimaResumenSchema.optional(),
  tendencia: TendenciaResumenSchema.optional(),

  /** Temperatura media diaria REAL de los ultimos dias (sparkline, mas viejo primero). */
  serieTemperatura: z.array(PuntoTemperaturaResumenSchema).optional(),
  /** Temperatura media diaria PRONOSTICADA (continua el sparkline hacia adelante). */
  pronosticoTemperatura: z.array(PuntoTemperaturaResumenSchema).optional(),

  /**
   * Siempre `true` en las entradas devueltas: la respuesta trae **solo** los hijos
   * con al menos una Localidad visible para el usuario. Un hijo de la grilla que no
   * aparezca en la respuesta no tiene localidades, y la tarjeta lo dice asi en vez
   * de mostrar "Sin dato climatico" (que es otra cosa: hay localidades pero todavia
   * no hay clima cargado para ellas).
   */
  tieneLocalidades: z.boolean().optional(),
});
export type IResumenClimaHijo = z.infer<typeof ResumenClimaHijoSchema>;
