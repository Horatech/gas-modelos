import { ICoordenadas } from '../auxiliares';
import { IUnidadNegocio, ICentroOperativo, ICuenca, IGrupo } from '../gas';
import { IReporteMra } from './reporteMra.model';

export interface IMedidorResidencialAgua {
  _id: string;
  //
  deviceMeterNumber: number;
  deveui: string;
  deviceName?: string;
  fechaCreacion: string;
  //
  ultimoReporte?: IReporteMra;
  //
  consumoInicial?: number;
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  nombre?: string;
  descripcion?: string;
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
}
