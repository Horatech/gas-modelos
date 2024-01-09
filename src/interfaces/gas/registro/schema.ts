import { ICliente } from '../../tenant';
import { ICentroOperativo } from '../centroOperativo';
import { ICorrectora } from '../correctora';
import { ICuenca } from '../cuenca';
import { IGrupo } from '../grupo';
import { IPuntoMedicion } from '../punto-medicion';
import { IUnidadNegocio } from '../unidadNegocio';

export interface IRegistro {
  _id?: string;
  timestamp?: string;
  corrected?: number;
  uncorrected?: number;
  presion?: number;
  temperatura?: number;
  contador?: number;
  bateria?: number;
  // Valores firmware nuevo
  correctedTotalizado?: number;
  uncorrectedTotalizado?: number;
  correctedParcializado?: number;
  uncorrectedParcializado?: number;
  caudalPromedio?: number;
  caudalPico?: number;
  //
  numeroSerieCorrectora?: string | null;
  deveui?: string;
  deviceName?: string;
  modelo?: string;
  //
  idCorrectora?: string;
  idPuntoMedicion?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  //
  fechaCreacion?: string;

  // Virtuals
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  cuenca?: ICuenca;
  correctora?: ICorrectora;
  puntoMedicion?: IPuntoMedicion;
  grupos?: IGrupo[];
}
