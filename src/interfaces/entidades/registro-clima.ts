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

/** Proveedor del dato climatico. OpenWeatherMap es el primario del MVP. */
export type FuenteClima =
  | "OpenWeatherMap"
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

export interface IViento {
  velocidad?: number; // m/s
  direccion?: number; // grados 0-360 (de donde viene)
  rafaga?: number; // m/s
}

export interface IRegistroClima {
  _id?: string;

  timestamp?: string; // ISO UTC — instante del dato (o dia objetivo para PRONOSTICO/CLIMATOLOGIA)
  tipo?: TipoDatoClima;
  fuente?: FuenteClima;

  // Variables canonicas (normalizadas por gas-api-clima)
  temperatura?: number; // °C
  temperaturaMin?: number; // °C — agregados diarios / pronostico
  temperaturaMax?: number; // °C
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
