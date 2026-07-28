import { TipoDatoClima } from "./registro-clima";

/**
 * DTO de respuesta de las vistas RESUMEN por nivel jerarquico (INSIDEht 2.0).
 * Lo produce gas-api-cliente (a partir del rollup diario resumendiariolocalidad
 * + la serie de clima) y lo consume gas-web-cliente. No es una entidad.
 */

export type NivelResumen = "UnidadNegocio" | "CentroOperativo" | "Localidad";

/** Punto de la serie diaria: consumo + temperatura (tendencia + correlacion). */
export interface IPuntoSerieResumen {
  fecha: string; // inicio del dia gas
  // Consumo TOTALIZADO del dia (suma de todos los medidores del nivel).
  volumenGasTotal?: number;
  volumenCorregidoCorrectoras?: number;
  consumoResidencial?: number;
  // Consumo PROMEDIO por medidor del dia (= total / cantidad de medidores del nivel).
  // Independiente de la cantidad de medidores instalados: refleja la relacion
  // temperatura <-> consumo sin distorsionarse al agregar/quitar medidores.
  consumoResidencialPromedio?: number;
  consumoCorrectorasPromedio?: number;
  temperaturaMedia?: number;
  temperaturaMin?: number;
  temperaturaMax?: number;
  sensacionTermicaMedia?: number;
  // Horas del dia con dato climatico (24 = dia completo). Deja ver si un punto
  // de la correlacion se apoya en una media horaria completa o en pocas muestras.
  horasClima?: number;
}

/** Clima agregado al nivel (actual o un punto de pronostico). Unidades canonicas. */
export interface IClimaResumen {
  fecha?: string;
  tipo?: TipoDatoClima;
  temperatura?: number; // °C
  temperaturaMin?: number;
  temperaturaMax?: number;
  sensacionTermica?: number; // °C
  vientoVelocidad?: number; // m/s
  radiacion?: number; // W/m2
  humedad?: number; // %
}

export interface IResumenOperativoNivel {
  nivel: NivelResumen;
  id: string;
  desde?: string;
  hasta?: string;

  // Consumo agregado del periodo (suma de las filas de rollup del nivel)
  volumenGasTotal?: number;
  volumenBaseCorrectoras?: number;
  volumenCorregidoCorrectoras?: number;
  consumoResidencial?: number;
  cantidadCorrectoras?: number;
  cantidadMedidoresResidenciales?: number;
  cantidadLocalidades?: number; // localidades con dato en el periodo

  // Serie diaria (consumo + temperatura) para tendencia y correlacion clima-demanda
  serie?: IPuntoSerieResumen[];

  // Clima
  climaActual?: IClimaResumen; // punto horario mas cercano a ahora, promediado al nivel
  pronostico?: IClimaResumen[]; // PRONOSTICO a futuro (>=1 semana), por dia
}

/** Direccion de la tendencia de temperatura del pronostico. */
export type DireccionTendencia = "sube" | "baja" | "estable";

export interface ITendenciaResumen {
  direccion: DireccionTendencia;
  delta: number; // °C entre el inicio y el fin del pronostico
}

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
export interface IResumenClimaHijo {
  nivel: NivelResumen;
  id: string;

  climaActual?: IClimaResumen;
  tendencia?: ITendenciaResumen;

  /** Temperatura media diaria REAL de los ultimos dias (sparkline, mas viejo primero). */
  serieTemperatura?: IPuntoTemperaturaResumen[];
  /** Temperatura media diaria PRONOSTICADA (continua el sparkline hacia adelante). */
  pronosticoTemperatura?: IPuntoTemperaturaResumen[];

  /**
   * Siempre `true` en las entradas devueltas: la respuesta trae **solo** los hijos
   * con al menos una Localidad visible para el usuario. Un hijo de la grilla que no
   * aparezca en la respuesta no tiene localidades, y la tarjeta lo dice asi en vez
   * de mostrar "Sin dato climatico" (que es otra cosa: hay localidades pero todavia
   * no hay clima cargado para ellas).
   */
  tieneLocalidades?: boolean;
}

export interface IPuntoTemperaturaResumen {
  fecha: string; // ISO (dia)
  temperatura?: number; // °C
}
