import { IRegistro } from "..";
import { GeoJSON, ICoordenadas } from "../../auxiliares";
import { IAlerta } from "../alerta";

export interface IUpdateUnidadPresion {
  firmware?: string;
  numeroSerie?: number;
  deveui?: string | null;
  deviceName?: string;
  modelo?: string;
  bateria?: number;
  //
  ultimoRegistro?: IRegistro;
  ultimaAlerta?: IAlerta;
  //
  ubicacion?: ICoordenadas;
  geojson?: GeoJSON;
  direccion?: string;
  localidad?: string;
  nombre?: string;
  descripcion?: string;
  estadoActual?: "Operativa" | "En Mantenimiento" | "Resolver" | string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idCuenca?: string;
  idsGrupos?: string[];
}
