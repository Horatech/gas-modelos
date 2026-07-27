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
