import { GeoJSON, ICoordenadas } from "../../auxiliares";
import { Division } from "../../tenant";

export interface ICreatePuntoMedicion {
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
  division?: Division;
}
