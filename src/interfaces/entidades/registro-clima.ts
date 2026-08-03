import { ICliente } from "../tenant";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ILocalidad } from "./localidad";
import { ICoordenadas } from "../auxiliares/coordenadas";

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
export type FuenteClima =
  | "OpenWeatherMap"
  | "ERA5-Land" // reanalisis Copernicus CDS — serie historica (grados-dia, normal)
  | "Open-Meteo"
  | "SMN"
  | "Estacion"; // estacion meteorologica propia (futuro, fuera de alcance MVP)

/**
 * Tipo de dato climatico.
 * - "ACTUAL": observacion/estado presente.
 * - "PRONOSTICO": pronostico a futuro (fuente 1 — API).
 * - "CLIMATOLOGIA": normal esperada derivada del historico de la ubicacion
 *   (fuente 2 — "el historico de la ubicacion geografica"), por dia del año.
 */
export type TipoDatoClima = "ACTUAL" | "PRONOSTICO" | "CLIMATOLOGIA";

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
export type GranularidadClima = "horaria" | "diaria";

export interface IViento {
  velocidad?: number; // m/s
  direccion?: number; // grados 0-360 (de donde viene)
  rafaga?: number; // m/s
}

export interface IRegistroClima {
  _id?: string;

  timestamp?: string; // ISO UTC — instante del dato (o dia objetivo para PRONOSTICO/CLIMATOLOGIA)
  tipo?: TipoDatoClima;
  granularidad?: GranularidadClima; // resolucion temporal (ver type)
  fuente?: FuenteClima;

  // Variables canonicas (normalizadas por gas-api-clima)
  temperatura?: number; // °C
  temperaturaMin?: number; // °C — agregados diarios / pronostico
  temperaturaMax?: number; // °C
  sensacionTermica?: number; // °C — temperatura aparente (viento/humedad); driver de consumo
  viento?: IViento;
  radiacion?: number; // W/m2 — relevante para agua
  humedad?: number; // % — opcional
  presionAtmosferica?: number; // hPa — opcional

  ubicacion?: ICoordenadas; // centroide consultado (el de la Localidad)

  //
  idLocalidad?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  //
  fechaCreacion?: string;

  // Virtuals
  localidad?: ILocalidad;
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "localidad"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo";
export interface ICreateRegistroClima
  extends Omit<Partial<IRegistroClima>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "localidad"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo";
export interface IUpdateRegistroClima
  extends Omit<Partial<IRegistroClima>, OmitirUpdate> {}
