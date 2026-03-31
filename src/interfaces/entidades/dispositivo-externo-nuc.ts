import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ICliente } from "../tenant/cliente.model";
import { IAlerta } from "./alerta";
import { IDispositivo } from "./dispositivo";
import { ILocalidad } from "./localidad";
import { IReporte } from "./reporte";

export type TipoInput = "Alarma" | "Contador" | "Testigo" | "Estado";

export interface IDispositivoExternoNuc {
  // Info autogenerada
  _id?: string;
  fechaCreacion?: string;
  // Tenant
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;

  // Info de carga
  identificador?: string; // Identificador del dispositivo externo (ej: "Medidor de presión del pozo 1")
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  deveui?: string; // deveui del nuc asignado al dispositivo externo
  // Input 1
  usaInput1?: boolean; // Si el dispositivo externo reporta un valor de input1
  // tipoInput1?: TipoInput; // Esto se define en el dispositivo
  nombreInput1?: string; // Nombre personalizado para el input1 (ej: "Alarma de fuga")
  factorCorreccionInput1?: number; // Factor de corrección para el input1 (multiplicador para convertir pulsos en consumo o valor real, aplica cuando el tipo es "Contador")
  valorInicialInput1?: number; // Valor inicial para el input1 (ej: lectura del contador al momento de asignar el dispositivo, aplica cuando el tipo es "Contador")
  // Input 2
  usaInput2?: boolean; // Si el dispositivo externo reporta un valor de input2
  // tipoInput2?: TipoInput; // Esto se define en el dispositivo
  nombreInput2?: string; // Nombre personalizado para el input2 (ej: "Contador de eventos")
  factorCorreccionInput2?: number; // Factor de corrección para el input2 (multiplicador para convertir pulsos en consumo o valor real, aplica cuando el tipo es "Contador")
  valorInicialInput2?: number; // Valor inicial para el input2 (ej: lectura del contador al momento de asignar el dispositivo, aplica cuando el tipo es "Contador")
  // Output
  usaOutput1?: boolean; // Si el dispositivo externo tiene un valor de output1 que se puede controlar
  // horaActivacionOutput1?: number; // Segundos a partir de las 00:00 del dia en que se activa el output1 (ej: 3600 para activar a la 1am) // Se define en el dispositivo
  // tiempoActivacionOutput1?: number; // Tiempo en minutos que se mantiene activo el output1 al activarse (ej: 1) // Se define en el dispositivo

  ultimoReporte?: IReporte;
  ultimaAlerta?: IAlerta;

  // Virtuals
  dispositivo?: IDispositivo; // Vinculacion al dispositivo mediante el deveui
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "dispositivo"
  | "cliente"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad";
export interface ICreateDispositivoExternoNuc extends Omit<
  Partial<IDispositivoExternoNuc>,
  OmitirCreate
> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "dispositivo"
  | "cliente"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad";
export interface IUpdateDispositivoExternoNuc extends Omit<
  Partial<IDispositivoExternoNuc>,
  OmitirUpdate
> {}
