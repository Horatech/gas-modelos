import { ICentroOperativo, IUnidadNegocio } from "../../gas";
import { IDispositivo } from "../dispositivo";
import { ILocalidad } from "../localidad";
import { IPuntoMedicion } from "../punto-medicion";

// Interface para el volumen acumulado del mes
export interface IVolumenAcumuladoMes {
  volumenBaseAcumulado: number;
  volumenCorregidoAcumulado: number;
}

// Interface principal del estado general de correctoras
export interface IEstadoGeneralCorrectoras {
  _id?: string;

  // Metadata
  fechaCreacion: string;
  mes: number;
  anio: number;

  // Filtros aplicados (referencia a entidades)
  idCliente?: string;
  idDispositivo?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idPuntoMedicion?: string;

  // Datos calculados
  fechaDesdeMes: string;
  fechaHastaMes: string;
  volumenAcumuladoMes: IVolumenAcumuladoMes;
  promedioPresionRedMes: number;
  promedioTemperaturaRedMes: number;
  cantidadCorrectoras: number;

  // Hash del query para identificar búsquedas duplicadas
  queryHash?: string;
  // Fecha de última actualización del registro
  fechaActualizacion?: string;
  estado?: "Recalcular" | "Activo" | "Error";
  fechaRecalculo?: string;

  // Populate
  puntoMedicion?: IPuntoMedicion;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
  dispositivo?: IDispositivo;
}

type Omitir =
  | "_id"
  | "fechaCreacion"
  | "puntoMedicion"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad"
  | "dispositivos";

export interface ICreateEstadoGeneralCorrectoras extends Omit<
  Partial<IEstadoGeneralCorrectoras>,
  Omitir
> {}

export interface IUpdateEstadoGeneralCorrectoras extends Omit<
  Partial<IEstadoGeneralCorrectoras>,
  Omitir
> {}
