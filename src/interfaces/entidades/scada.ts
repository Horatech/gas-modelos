import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import {
  IAlerta,
  IConfigDispositivoScada,
  IEstado,
  ILocalidad,
  IReporte,
} from ".";
import { ICliente } from "../tenant";

export type TipoScada =
  | "Presión en bar"
  | "Presión en mbar"
  | "Temperatura en C"
  | "Porcentaje"
  | "Booleano"
  | "mg sobre m3"
  | "Voltaje en V"
  | "Corriente en A"
  | "Potencial en mV";
export type DivisionScada = "Unifilar" | "Medición";

export interface IScada {
  _id?: string;
  //
  fechaCreacion?: string;
  nombre?: string; /// Input
  tag?: string; /// Esto configura el tag para el OPC
  tipo?: TipoScada;
  division?: DivisionScada;
  unidad?: string; // Input, para saber que reporta (además del tipo)
  // Booleano
  booleano?: boolean; // Input, para saber si es un valor booleano (Reporta 1 o 0 y andá a saber cuál es cuál) // Al final reporta true o false pero lo convierto a número para no empmarme el tipo del CV
  booleanoValorAlarma?: boolean; // Input, para saber si el valor de alarma es 1 o 0
  //
  ultimoRegistro?: IReporte;
  ultimaAlerta?: IAlerta;
  //
  habilitado?: boolean;
  estadoActual?: IEstado;
  config?: IConfigDispositivoScada;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  // Populate
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
}

type Omitir =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "cliente";

export interface ICreateScada extends Omit<Partial<IScada>, Omitir> {}

export interface IUpdateScada extends Omit<Partial<IScada>, Omitir> {}
