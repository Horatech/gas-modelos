import { z } from "zod";
import { ClienteSchema } from "../tenant/cliente.model";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { LocalidadSchema } from "./localidad";
import { CoordenadasSchema } from "../auxiliares/coordenadas";

/**
 * Registro climatico de una Localidad (INSIDEht 2.0).
 *
 * Serie temporal propia, servida por gas-api-clima y persistida en gas-datos
 * (coleccion propia, upsert por `idLocalidad` + `timestamp` + `tipo` + `fuente`).
 * El clima se resuelve POR LOCALIDAD (centroide); UN/CO promedian hacia arriba.
 *
 * Las unidades son CANONICAS (ver cada campo): gas-api-clima normaliza lo que
 * devuelve cada proveedor a estas unidades antes de persistir. Este paquete es
 * solo de tipos (no se compila a JS), por eso las unidades se documentan aca.
 */

/**
 * Proveedor del dato climatico.
 *
 * Hay DOS fuentes en produccion y cubren cosas distintas:
 * - **OpenWeatherMap** — el PRESENTE: `ACTUAL`, `PRONOSTICO` y los tiles del mapa.
 * - **ERA5-Land** — el PASADO: reanalisis de 9 km del Copernicus CDS, base de los
 *   grados-dia y de la normal climatica. No vive en esta coleccion sino en el store
 *   propio de `gas-api-clima` (ver `clima-historico.ts`).
 *
 * Se mantienen deliberadamente separadas: son series con sesgos distintos y **mezclarlas
 * en un mismo calculo mete un escalon**. Un modelo entrenado contra ERA5-Land y evaluado
 * contra OWM arrastra un offset sistematico que se lee como "el consumo viene raro".
 */
export const FuenteClimaSchema = z.enum([
  "OpenWeatherMap",
  "ERA5-Land", // reanalisis Copernicus CDS — serie historica (grados-dia, normal)
  "Open-Meteo",
  "SMN",
  "Estacion", // estacion meteorologica propia (futuro, fuera de alcance MVP)
]);
export type FuenteClima = z.infer<typeof FuenteClimaSchema>;

/**
 * Tipo de dato climatico.
 * - "ACTUAL": observacion/estado presente.
 * - "PRONOSTICO": pronostico a futuro (fuente 1 — API).
 * - "CLIMATOLOGIA": normal esperada derivada del historico de la ubicacion
 *   (fuente 2 — "el historico de la ubicacion geografica"), por dia del año.
 */
export const TipoDatoClimaSchema = z.enum([
  "ACTUAL",
  "PRONOSTICO",
  "CLIMATOLOGIA",
]);
export type TipoDatoClima = z.infer<typeof TipoDatoClimaSchema>;

/**
 * Resolucion temporal del dato. Discrimina la serie HORARIA de la DIARIA:
 * ambas se persisten con `tipo: "PRONOSTICO"` y sin este campo NO se pueden
 * separar. Mezclarlas rompe los dos calculos que dependen del clima:
 * - el promedio diario (una media de 24 muestras horarias vs 1-3 muestras diurnas), y
 * - la curva de pronostico (promediar horas sueltas con la media del dia sesga
 *   los primeros dias, donde hay serie horaria, contra el resto donde no).
 *
 * - "horaria": una muestra por hora (instante). Es la que se promedia para el dia.
 * - "diaria": un punto por dia con `temperatura` = media del dia + min/max.
 *
 * Los registros previos a este campo quedan sin `granularidad`: los `ACTUAL`
 * historicos (poleo horario y backfill Open-Meteo) se tratan como horarios, y
 * los `PRONOSTICO` sin granularidad se excluyen de los calculos diarios.
 */
export const GranularidadClimaSchema = z.enum(["horaria", "diaria"]);
export type GranularidadClima = z.infer<typeof GranularidadClimaSchema>;

export const VientoSchema = z.object({
  velocidad: z.number().optional(), // m/s
  direccion: z.number().optional(), // grados 0-360 (de donde viene)
  rafaga: z.number().optional(), // m/s
});
export type IViento = z.infer<typeof VientoSchema>;

export const RegistroClimaSchema = z.object({
  _id: z.string().optional(),

  timestamp: z.string().optional(), // ISO UTC — instante del dato (o dia objetivo para PRONOSTICO/CLIMATOLOGIA)
  tipo: TipoDatoClimaSchema.optional(),
  granularidad: GranularidadClimaSchema.optional(), // resolucion temporal (ver type)
  fuente: FuenteClimaSchema.optional(),

  // Variables canonicas (normalizadas por gas-api-clima)
  temperatura: z.number().optional(), // °C
  temperaturaMin: z.number().optional(), // °C — agregados diarios / pronostico
  temperaturaMax: z.number().optional(), // °C
  sensacionTermica: z.number().optional(), // °C — temperatura aparente (viento/humedad); driver de consumo
  viento: VientoSchema.optional(),
  radiacion: z.number().optional(), // W/m2 — relevante para agua
  humedad: z.number().optional(), // % — opcional
  presionAtmosferica: z.number().optional(), // hPa — opcional

  ubicacion: CoordenadasSchema.optional(), // centroide consultado (el de la Localidad)

  //
  idLocalidad: z.string().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  //
  fechaCreacion: z.string().optional(),

  // Virtuals
  localidad: LocalidadSchema.optional(),
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
});
export type IRegistroClima = z.infer<typeof RegistroClimaSchema>;

////// CREATE
export const CreateRegistroClimaSchema = RegistroClimaSchema.omit({
  _id: true,
  localidad: true,
  cliente: true,
  unidadNegocio: true,
  centroOperativo: true,
});
export type ICreateRegistroClima = z.infer<typeof CreateRegistroClimaSchema>;

////// UPDATE
export const UpdateRegistroClimaSchema = RegistroClimaSchema.omit({
  _id: true,
  localidad: true,
  cliente: true,
  unidadNegocio: true,
  centroOperativo: true,
});
export type IUpdateRegistroClima = z.infer<typeof UpdateRegistroClimaSchema>;
