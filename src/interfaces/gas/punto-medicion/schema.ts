import { GeoJSON, ICoordenadas } from "../../auxiliares";
import { Division, ICliente } from "../../tenant";
import { IAgrupacion } from "../agrupacion";
import { ICentroOperativo } from "../centroOperativo";
import { ICorrectora } from "../correctora";
import { ICuenca } from "../cuenca";
import { IGrupo } from "../grupo";
import { IUnidadNegocio } from "../unidadNegocio";
import { IUnidadPresion } from "../unidadPresion";

export interface IPuntoMedicion {
  _id?: string;
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
  // Calculado por el backend
  estado?:
    | "Sin Asignar"
    | "En Mantenimiento"
    | "Resolver"
    | "Sin Reportar"
    | "Operativa"
    | "Alerta";
  // Tenancy
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idsGrupos?: string[];
  idsAgrupaciones?: string[];
  idCuenca?: string;
  division?: Division;
  // Virtuals
  correctora?: ICorrectora;
  unidadPresion?: IUnidadPresion;
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  grupos?: IGrupo[];
  agrupaciones?: IAgrupacion[];
  cuenca?: ICuenca;
}
