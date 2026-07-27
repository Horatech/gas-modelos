import { ICliente } from "../tenant";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ILocalidad } from "./localidad";

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
export interface IResumenDiarioLocalidad {
  _id?: string;

  fecha?: string; // ISO UTC — inicio del dia gas

  // Jerarquia (denormalizada)
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;

  // Consumo / volumen de gas del dia (m3)
  volumenBaseCorrectoras?: number; // suma uncorrectedParcializado
  volumenCorregidoCorrectoras?: number; // suma correctedParcializado
  consumoResidencial?: number; // delta del acumulado valores.consumo de los medidores del dia
  volumenGasTotal?: number; // corregido correctoras + residencial
  cantidadCorrectoras?: number;
  cantidadMedidoresResidenciales?: number;

  // Clima del dia (canonico). Se calcula sobre la serie HORARIA del dia
  // (granularidad "horaria", cualquier tipo), agrupando primero por hora para
  // que cada hora pese igual y no se cuente dos veces. La serie diaria de
  // pronostico (granularidad "diaria") NO entra: describe el dia entero, no un
  // instante, y duplicaria el peso de ese dia.
  temperaturaMedia?: number; // °C — media de las horas del dia
  temperaturaMin?: number; // °C — minima horaria del dia
  temperaturaMax?: number; // °C — maxima horaria del dia
  sensacionTermicaMedia?: number; // °C
  vientoVelocidadMedia?: number; // m/s
  horasClima?: number; // horas distintas con dato (calidad de la media: 24 = dia completo)

  // Idempotencia / control (patron estadogeneralcorrectoras)
  queryHash?: string;
  estado?: EstadoResumenDiario;
  fechaCreacion?: string;

  // Virtuals
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
}

export type EstadoResumenDiario = "Activo" | "Recalcular" | "Error";

////// CREATE
type OmitirCreate =
  | "_id"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad";
export interface ICreateResumenDiarioLocalidad
  extends Omit<Partial<IResumenDiarioLocalidad>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad";
export interface IUpdateResumenDiarioLocalidad
  extends Omit<Partial<IResumenDiarioLocalidad>, OmitirUpdate> {}
