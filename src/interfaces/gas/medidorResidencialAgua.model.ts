import { ICoordenadas } from '../auxiliares';
import { IDispositivo, ITipoDispositivo } from '../tenant';
import { ICentroOperativo } from './centroOperativo.model';
import { ICuenca } from './cuenca.model';
import { IGrupo } from './grupo.model';
import { IReporteSml } from './reporteSml.model';
import { IUnidadNegocio } from './unidadNegocio.model';

export interface IMedidorResidencialAgua {
  _id: string;
  //
  deviceMeterNumber: number;
  deveui: string;
  deviceName?: string;
  fechaCreacion: string;
  //
  ultimoReporte?: IReporteSml;
  //
  consumoInicial?: number;
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  nombre?: string;
  descripcion?: string;
  corregido?: boolean;
  //
  idCliente: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  cuenca?: ICuenca;
  grupos?: IGrupo[];
  dispositivo?: IDispositivo;
}
