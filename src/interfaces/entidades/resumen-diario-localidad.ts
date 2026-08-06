import { z } from "zod";
import { ClienteSchema } from "../tenant/cliente.model";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { LocalidadSchema } from "./localidad";

export const EstadoResumenDiarioSchema = z.enum([
  "Activo",
  "Recalcular",
  "Error",
]);
export type EstadoResumenDiario = z.infer<typeof EstadoResumenDiarioSchema>;

/**
 * Rollup DIARIO por Localidad (INSIDEht 2.0) para las vistas resumen.
 *
 * Materializado por gas-cron (patron de estadogeneralcorrectoras): agrega el
 * consumo/volumen de gas del dia (correctoras + residencial) y el clima del dia
 * por Localidad. Los niveles CO y UN se obtienen re-agrupando estas filas
 * (barato) — la geo/agregacion parte SIEMPRE de la jerarquia; puntos sin
 * UN/CO/Localidad quedan afuera.
 *
 * Coleccion propia, upsert idempotente por `queryHash` (dia + localidad).
 * PRESION queda FUERA: no se promedia entre niveles de presion de red
 * (mallada urbana vs anillos aguas arriba de estacion reguladora); requiere
 * categorizar por nivel/rol de red — investigacion pendiente.
 *
 * "Dia gas" arranca 07:00 AR (10:00 UTC), igual que el resto del dominio gas.
 */
export const ResumenDiarioLocalidadSchema = z.object({
  _id: z.string().optional(),

  fecha: z.string().optional(), // ISO UTC — inicio del dia gas

  // Jerarquia (denormalizada)
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),

  // Consumo / volumen de gas del dia (m3)
  volumenBaseCorrectoras: z.number().optional(), // suma uncorrectedParcializado
  volumenCorregidoCorrectoras: z.number().optional(), // suma correctedParcializado
  consumoResidencial: z.number().optional(), // delta del acumulado valores.consumo de los medidores del dia
  volumenGasTotal: z.number().optional(), // corregido correctoras + residencial
  cantidadCorrectoras: z.number().optional(),
  cantidadMedidoresResidenciales: z.number().optional(),

  // Clima del dia (canonico). Se calcula sobre la serie HORARIA del dia
  // (granularidad "horaria", cualquier tipo), agrupando primero por hora para
  // que cada hora pese igual y no se cuente dos veces. La serie diaria de
  // pronostico (granularidad "diaria") NO entra: describe el dia entero, no un
  // instante, y duplicaria el peso de ese dia.
  temperaturaMedia: z.number().optional(), // °C — media de las horas del dia
  temperaturaMin: z.number().optional(), // °C — minima horaria del dia
  temperaturaMax: z.number().optional(), // °C — maxima horaria del dia
  sensacionTermicaMedia: z.number().optional(), // °C
  vientoVelocidadMedia: z.number().optional(), // m/s
  horasClima: z.number().optional(), // horas distintas con dato (calidad de la media: 24 = dia completo)

  // ── Grados-dia (ERA5-Land) ────────────────────────────────────────────
  // Los escribe gas-api-clima copiando el dia ya calculado de su store propio.
  // Se COPIAN y no se leen al vuelo para que el camino de servicio de las vistas
  // siga siendo una sola consulta a Mongo, sin cruzar a otra base.
  //
  // OJO: estos campos NO son la temperatura de arriba. Esa viene de la serie de
  // OpenWeatherMap, que en PROD tiene ~1 muestra por dia en la mayoria de las
  // filas; los grados-dia salen del reanalisis ERA5-Land, con las 24 horas.

  /** Celda de la grilla que abastece a esta Localidad. Trazabilidad del dato. */
  claveGridEra5: z.string().optional(),

  /**
   * Grados-dia de calefaccion del dia, indexados por temperatura BASE en °C:
   * `{ "18": 9.4, "20": 11.4 }`.
   *
   * Se guarda el VECTOR entero y no un escalar porque la base todavia no esta
   * decidida: se calibra con consenso de cada tenant (ver PLAN-GRADOS-DIA.md
   * §F5-bis). Con el vector, cambiar la base es una decision de LECTURA y no
   * obliga a recalcular el rollup de todas las Localidades.
   */
  gradosDia: z.record(z.string(), z.number()).optional(),

  /** Idem sobre sensacion termica (wind chill). Relevante en Patagonia ventosa. */
  gradosDiaEfectivos: z.record(z.string(), z.number()).optional(),

  /**
   * Normal 1991-2020 de ESE dia del año, mismo indexado por base. Es contra esto
   * que se mide el desvio: sin la normal, un grado-dia suelto no dice nada.
   */
  gradosDiaNormal: z.record(z.string(), z.number()).optional(),

  /**
   * Percentiles 10 y 90 de la MISMA normal (`gradosDiaNormal` es la mediana),
   * mismo indexado por base.
   *
   * Son la banda de lo habitual para ese dia del año: dicen si el desvio del dia
   * entra en la variabilidad normal o se sale de ella. Sin la banda, un +30%
   * sobre la mediana es indistinguible de un dia raro y de un dia frio de
   * verdad — en pleno invierno la dispersion interanual de un dia suelto es
   * enorme.
   *
   * ⚠️ **No son aditivos.** Sumar los p10 diarios NO da el p10 del acumulado:
   * los desvios diarios se cancelan entre si a lo largo de la temporada, asi que
   * la suma produce una banda mucho mas ancha que la real y nada cae nunca
   * afuera. La banda del ACUMULADO se percentila sobre acumulados de temporada,
   * y eso necesita primero una definicion de temporada (pendiente por cliente).
   * Estos dos campos son para el grafico DIARIO.
   */
  gradosDiaNormalP10: z.record(z.string(), z.number()).optional(),
  gradosDiaNormalP90: z.record(z.string(), z.number()).optional(),

  /** Temperatura efectiva: `0,5·T(d) + 0,5·T_ef(d−1)`. Inercia termica del parque. */
  temperaturaEfectiva: z.number().optional(), // °C

  /** Dias consecutivos de helada hasta este dia. Insumo de integridad de cañeria. */
  heladaConsecutivos: z.number().optional(),

  /**
   * `false` mientras el dia provenga de ERA5-Land-T (near-real-time, sin control
   * de calidad). El consolidado sale 2-3 meses despues y los valores CAMBIAN.
   */
  climaConsolidado: z.boolean().optional(),

  // Idempotencia / control (patron estadogeneralcorrectoras)
  queryHash: z.string().optional(),
  estado: EstadoResumenDiarioSchema.optional(),
  fechaCreacion: z.string().optional(),

  // Virtuals
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
});
export type IResumenDiarioLocalidad = z.infer<
  typeof ResumenDiarioLocalidadSchema
>;

////// CREATE
export const CreateResumenDiarioLocalidadSchema =
  ResumenDiarioLocalidadSchema.omit({
    _id: true,
    cliente: true,
    unidadNegocio: true,
    centroOperativo: true,
    localidad: true,
  });
export type ICreateResumenDiarioLocalidad = z.infer<
  typeof CreateResumenDiarioLocalidadSchema
>;

////// UPDATE
export const UpdateResumenDiarioLocalidadSchema =
  ResumenDiarioLocalidadSchema.omit({
    _id: true,
    cliente: true,
    unidadNegocio: true,
    centroOperativo: true,
    localidad: true,
  });
export type IUpdateResumenDiarioLocalidad = z.infer<
  typeof UpdateResumenDiarioLocalidadSchema
>;
