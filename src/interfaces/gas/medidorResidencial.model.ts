import { ICoordenadas } from '../auxiliares';
import { ITipoDispositivo } from '../tenant';
import { ICentroOperativo } from './centroOperativo.model';
import { ICuenca } from './cuenca.model';
import { IGrupo } from './grupo.model';
import { IReporteSml } from './reporteSml.model';
import { IUnidadNegocio } from './unidadNegocio.model';

export interface IMedidorResidencial {
  _id: string;
  //
  deviceMeterNumber: number;
  deveui: string;
  deviceName?: string;
  fechaCreacion: string;
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
