import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ICliente } from "../tenant/cliente.model";
import { ILoraServer } from "../tenant/lora-server.model";
import { ILoteDispositivo } from "../tenant/loteDispositivo.model";
import { IAlerta } from "./alerta";
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
  nombre?: string;
  deveui?: string; // deveui del nuc asignado al dispositivo externo
  // Input 1
  usaInput1?: boolean; // Si el dispositivo externo reporta un valor de input1
  tipoInput1?: TipoInput;
  nombreInput1?: string; // Nombre personalizado para el input1 (ej: "Alarma de fuga")
  factorCorreccionInput1?: number; // Factor de corrección para el input1 (multiplicador para convertir pulsos en consumo o valor real, aplica cuando el tipo es "Contador")
  valorInicialInput1?: number; // Valor inicial para el input1 (ej: lectura del contador al momento de asignar el dispositivo, aplica cuando el tipo es "Contador")
  // Input 2
  usaInput2?: boolean; // Si el dispositivo externo reporta un valor de input2
  tipoInput2?: TipoInput;
  nombreInput2?: string; // Nombre personalizado para el input2 (ej: "Contador de eventos")
  factorCorreccionInput2?: number; // Factor de corrección para el input2 (multiplicador para convertir pulsos en consumo o valor real, aplica cuando el tipo es "Contador")
  valorInicialInput2?: number; // Valor inicial para el input2 (ej: lectura del contador al momento de asignar el dispositivo, aplica cuando el tipo es "Contador")
  // Output
  usaOutput1?: boolean; // Si el dispositivo externo tiene un valor de output1 que se puede controlar
  horaActivacionOutput1?: number; // Segundos a partir de las 00:00 del dia en que se activa el output1 (ej: 3600 para activar a la 1am)
  tiempoActivacionOutput1?: number; // Tiempo en minutos que se mantiene activo el output1 al activarse (ej: 1)

  ultimoReporte?: IReporte;
  ultimaAlerta?: IAlerta;

  // Virtuals
  cliente?: ICliente;
  lote?: ILoteDispositivo;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
  loraServer?: ILoraServer;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "cliente";
export interface ICreateDispositivoExternoNuc extends Omit<
  Partial<IDispositivoExternoNuc>,
  OmitirCreate
> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "cliente";
export interface IUpdateDispositivoExternoNuc extends Omit<
  Partial<IDispositivoExternoNuc>,
  OmitirUpdate
> {}
