import { GeoJSON, ICoordenadas } from '../../auxiliares/coordenadas';
import { IClient } from '../../oauth';
import { ICliente } from '../../tenant';
import { ICentroOperativo } from '../centroOperativo.model';
import { ICorrectora } from '../correctora';
import { IGrupo } from '../grupo.model';
import { IUnidadNegocio } from '../unidadNegocio.model';

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
  // Tenancy
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idsGrupos?: string[];
  // Virtuals
  correctora?: ICorrectora;
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  grupos?: IGrupo[];
}
