import { ICoordenadas } from '../auxiliares';
import { ITipoDispositivo } from '../tenant';
import { IReporteSml } from './reporteSml.model';

export interface ICreateMedidorResidencial {
  deviceMeterNumber: number;
  deveui: string;
  deviceName?: string;
  //
  ultimoReporte?: IReporteSml;
  tipo?: ITipoDispositivo;
  //
  consumoInicial?: number;
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  nombre?: string;
  descripcion?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idCuenca?: string;
  idsGrupos?: string[];
}

export interface IUpdateMedidorResidencial {
  deviceMeterNumber?: number;
  deveui?: string;
  deviceName?: string;
  //
  ultimoReporte?: IReporteSml;
  //
  consumoInicial?: number;
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  nombre?: string;
  descripcion?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idCuenca?: string;
  idsGrupos?: string[];
}
