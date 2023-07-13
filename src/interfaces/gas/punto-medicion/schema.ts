import { GeoJSON, ICoordenadas } from "../../auxiliares";
import { ICliente } from "../../tenant";
import { ICentroOperativo } from "../centroOperativo";
import { ICorrectora } from "../correctora";
import { IGrupo } from "../grupo";
import { IUnidadNegocio } from "../unidadNegocio";
import { IUnidadPresion } from "../unidadPresion";

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
  // Unidad de Presion
  idUnidadPresion?: string | null;
  // Tenancy
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idsGrupos?: string[];
  // Virtuals
  correctora?: ICorrectora;
  unidadPresion?: IUnidadPresion;
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  grupos?: IGrupo[];
}
