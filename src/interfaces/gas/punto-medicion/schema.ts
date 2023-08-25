import { GeoJSON, ICoordenadas } from '../../auxiliares';
import { ICliente } from '../../tenant';
import { ICentroOperativo } from '../centroOperativo';
import { ICorrectora } from '../correctora';
import { ICuenca } from '../cuenca';
import { IGrupo } from '../grupo';
import { IUnidadNegocio } from '../unidadNegocio';
import { IUnidadPresion } from '../unidadPresion';

export interface IPuntoMedicion {
  _id: string;
  // GPS
  geojson?: GeoJSON;
  ubicacion?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  // Detalles
  nombre?: string;
  descripcion?: string;
  codigoSimec?: string;
  // Correctora
  idCorrectora?: string | null;
  fechaAsignacionCorrectora?: string | null;
  // Unidad de Presion
  idUnidadPresion?: string | null;
  fechaAsignacionUnidadPresion?: string | null;
  // Tenancy
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idsGrupos?: string[];
  idCuenca?: string;
  // Virtuals
  correctora?: ICorrectora;
  unidadPresion?: IUnidadPresion;
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  grupos?: IGrupo[];
  cuenca?: ICuenca;
}
