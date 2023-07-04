import { GeoJSON, ICoordenadas } from '../../auxiliares/coordenadas';
import { ICorrectora } from '../correctora';

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
  idCorrectora?: string;
  // Virtuals
  correctora?: ICorrectora;
}
