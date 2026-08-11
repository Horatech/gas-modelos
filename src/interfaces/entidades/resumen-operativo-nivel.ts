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
/**
 * Sentido de los grados-día.
 *
 * - `calefaccion` (HDD): `Σ max(0, base − T)`. Cuánto frío hubo. Es el que gobierna la
 *   demanda de gas y el único que existía hasta ago 2026.
 * - `refrigeracion` (CDD): `Σ max(0, T − base)`. Cuánto calor hubo.
 *
 * Hace falta porque **la demanda eléctrica es bimodal en temperatura**: sube con el frío
 * y también con el calor. Con un solo sentido, el verano de una red eléctrica se lee como
 * si no pasara nada.
 *
 * La base ya era paramétrica (el rollup guarda el vector de 15 bases); lo que estaba
 * horneado era el sentido, en el nombre de los campos y en el cálculo. Ausente se lee
 * como `calefaccion`, que es lo que son todos los datos anteriores a este cambio.
 */
export const SentidoGradosDiaSchema = z.enum(["calefaccion", "refrigeracion"]);
export type SentidoGradosDia = z.infer<typeof SentidoGradosDiaSchema>;

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

  // ── Grados-dia, ya resueltos a la base vigente ────────────────────────
  // El rollup guarda el vector de 15 bases; aca viaja el ESCALAR de la base que
  // se esta usando, porque el frontend dibuja una serie, no quince. Cual es esa
  // base la dice `baseHdd` del nivel.

  /** Grados-dia del dia. Es el eje X natural de la correlacion con el consumo. */
  gradosDia: z.number().optional(),

  /** Grados-dia normales de ese dia del año. La referencia contra la que se mide. */
  gradosDiaNormal: z.number().optional(),

  /**
   * El grado-dia del dia **no** salio de ERA5-Land sino de la serie horaria de
   * OpenWeatherMap, porque ERA5 todavia no publico ese dia (~5 dias de atraso).
   *
   * Viaja como bandera y no como texto de fuente porque lo que el lector necesita saber
   * es una sola cosa: **este punto se va a mover** cuando llegue el dato definitivo. El
   * sesgo medido entre las dos series es de +0,25 a +0,48 °C, o sea ~0,3-0,5 grados-dia
   * por dia, y la normal contra la que se compara sigue siendo la de ERA5.
   *
   * En un nivel que agrega varias Localidades alcanza con que UNA aporte dato provisorio
   * para que el punto lo sea: el agregado ya quedo contaminado.
   */
  gradosDiaProvisorio: z.boolean().optional(),

  /**
   * Banda p10-p90 de la normal de ese dia del año: el rango de lo habitual.
   *
   * Es lo que convierte el punto diario en una lectura: un dia por encima de la
   * mediana puede seguir siendo un dia normal, y solo salirse de la banda lo
   * hace anomalo. Sin ella el grafico diario sugiere anomalias donde solo hay
   * variabilidad interanual.
   *
   * ⚠️ Es del DIA. No acumular: los percentiles no son aditivos (ver
   * `IResumenDiarioLocalidad.gradosDiaNormalP10`).
   */
  gradosDiaNormalP10: z.number().optional(),
  gradosDiaNormalP90: z.number().optional(),
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

/**
 * Un dia de grados-dia PROYECTADOS desde el pronostico.
 *
 * Es una proyeccion, no una medicion, y por eso viaja aparte de `serie` y no entra en
 * los acumulados ni en el desvio del nivel: el desvio mide lo que paso.
 */
export const PuntoGradosDiaPronosticoSchema = z.object({
  fecha: z.string(), // inicio del dia gas

  /** Ya resuelto a la base vigente (`baseHdd`), como el resto de la serie. */
  gradosDia: z.number(),

  /**
   * El dia se calculo por **integracion horaria** y no desde `(Tmax+Tmin)/2`.
   *
   * El pronostico horario cubre ~48 h; de ahi en adelante solo hay maxima y minima. El
   * metodo de la media subestima —medido sobre 790 pares Localidad-dia reales: −0,12
   * grados-dia, −2,5%— porque ignora cuanto tiempo estuvo la temperatura bajo la base.
   * A partir del dia 3 ese sesgo igual queda tapado por la incertidumbre del pronostico
   * en si (±2-3 °C son ±2-3 grados-dia), pero el consumidor tiene derecho a saber que
   * los dos tramos no se midieron igual.
   */
  integracionHoraria: z.boolean().optional(),

  /**
   * Normal 1991-2020 de ese dia del año, misma base.
   *
   * Viaja tambien en los dias futuros porque la normal **no es un dato del dia**: es la
   * climatologia del dia del AÑO, y existe para el 12 de agosto de cualquier año, haya
   * pasado o no. Sin ella el pronostico queda a medias — "vienen 18 grados-dia" no dice
   * si es mucho o poco—, que es justamente la lectura que se busca al mirar adelante.
   */
  gradosDiaNormal: z.number().optional(),
});
export type IPuntoGradosDiaPronostico = z.infer<
  typeof PuntoGradosDiaPronosticoSchema
>;

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

  /**
   * Localidades del nivel visibles para el usuario, tengan dato o no.
   * Con `cantidadLocalidadesConGeografia` es lo que permite distinguir los dos
   * "sin numero" que hoy se verian iguales y son opuestos.
   */
  cantidadLocalidadesTotal: z.number().optional(),

  /**
   * Cuantas de esas Localidades tienen centroide cargado.
   *
   * **Sin centroide no hay celda ERA5-Land y por lo tanto no hay grados-dia**, ni
   * los va a haber hasta que alguien cargue la geografia. No es un caso de borde:
   * son 175 Localidades de Naturgy BAN y todas las de Metrogas, Ecogas y Naturgy
   * NOA. Mostrar `0%` de desvio ahi seria mentir sobre miles de puntos; la vista
   * tiene que poder decir "sin geografia cargada" y distinguirlo de "todavia no
   * llego el dato climatico", que se resuelve solo.
   */
  cantidadLocalidadesConGeografia: z.number().optional(),

  // Serie diaria (consumo + temperatura) para tendencia y correlacion clima-demanda
  serie: z.array(PuntoSerieResumenSchema).optional(),

  // ── Grados-dia acumulados del periodo ─────────────────────────────────

  /**
   * Base en °C con la que se resolvieron los escalares de `serie` y de los
   * acumulados. Viaja explicita porque el numero no se interpreta sin ella:
   * 600 grados-dia base 18 y 600 base 22 describen inviernos muy distintos.
   */
  baseHdd: z.number().optional(),

  /**
   * Sentido con el que se resolvieron los escalares de `serie` y los acumulados.
   *
   * Viaja por el mismo motivo que `baseHdd`: sin él el número no se interpreta — 600
   * grados-día de calefacción y 600 de refrigeración describen estaciones opuestas.
   * Ausente se lee como `calefaccion`.
   */
  sentidoGradosDia: SentidoGradosDiaSchema.optional(),

  /** Suma de los grados-dia del periodo. Acumular sobre el TIEMPO si es valido. */
  gradosDiaAcumulado: z.number().optional(),

  /** Suma de la normal del mismo periodo. */
  gradosDiaNormalAcumulado: z.number().optional(),

  /**
   * Desvio del periodo respecto de lo normal, en %.
   *
   * Es el numero que un operador lee de un vistazo: "+10,5%" dice que el invierno
   * viene mas duro que lo habitual, y por lo tanto cuanto del aumento de consumo
   * es clima y no otra cosa. El grado-dia absoluto, solo, no dice nada.
   */
  desvioClimaticoPct: z.number().optional(),

  /**
   * Grados-dia PROYECTADOS de los proximos dias, para extender la curva.
   *
   * Separado de `serie` a proposito: es una proyeccion y no entra en
   * `gradosDiaAcumulado` ni en `desvioClimaticoPct`. Un desvio que mezcla medicion con
   * pronostico deja de ser una medicion, y es el numero que el operador usa para decidir.
   *
   * Se calcula **por Localidad y se agrega ponderado por carga**, igual que la serie
   * real. Hacerlo sobre la temperatura ya promediada del nivel —que es lo que haria el
   * frontend con `pronostico`— subestima entre 9% y 24%: medido sobre 29 dias de una UN,
   * −9,1% partiendo de la media y −23,6% partiendo de `(Tmax+Tmin)/2`. Es el mismo
   * Jensen que gobierna el resto del diseño.
   */
  pronosticoGradosDia: z.array(PuntoGradosDiaPronosticoSchema).optional(),

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

/**
 * Desvio climatico de un hijo del nivel actual, para la barra comparativa.
 *
 * Va SEPARADO de `IResumenClimaHijo` por dos razones, y las dos importan:
 *
 * 1. **Depende del rango de fechas y la tarjeta no.** La grilla de tarjetas es
 *    climatica y se cachea por (nivel, padre); si el desvio viajara adentro, cada
 *    cambio de rango invalidaria esa cache y volveria a pedir clima horario,
 *    pronostico y sparklines que no cambiaron.
 * 2. **Sale de otra fuente.** La tarjeta se arma con `registroclimas`; esto sale
 *    del rollup diario, con la misma agregacion ponderada del nivel.
 *
 * Es el gráfico que responde "¿a que UN le esta pegando el frio?": el grado-dia
 * ABSOLUTO no sirve para eso —entre celdas de una misma UN la amplitud llega al
 * 68%, asi que ordenar por absoluto ordena por geografia, no por anomalia—, pero
 * el desvio si, porque cada celda se compara contra SU propia normal y eso cancela
 * la heterogeneidad geografica.
 */
export const ResumenDesvioHijoSchema = z.object({
  nivel: NivelResumenSchema,
  id: z.string(),

  /** Base en °C con la que se resolvieron los acumulados. Ver `baseHdd` del nivel. */
  baseHdd: z.number().optional(),
  /** Sentido con el que se resolvieron. Ver `sentidoGradosDia` del nivel. */
  sentidoGradosDia: SentidoGradosDiaSchema.optional(),

  gradosDiaAcumulado: z.number().optional(),
  gradosDiaNormalAcumulado: z.number().optional(),
  desvioClimaticoPct: z.number().optional(),

  /**
   * Ninguna Localidad del hijo tiene centroide: no va a tener grados-dia hasta que
   * se cargue la geografia. Se distingue del hijo que si tiene celda pero todavia
   * no tiene dato — el primero necesita una accion, el segundo se resuelve solo.
   */
  sinGeografia: z.boolean().optional(),
});
export type IResumenDesvioHijo = z.infer<typeof ResumenDesvioHijoSchema>;
