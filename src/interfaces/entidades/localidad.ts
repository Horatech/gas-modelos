import { ICliente } from "../tenant";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ICoordenadas, GeoJSON } from "../auxiliares/coordenadas";

/**
 * Origen de la geometria de una Localidad.
 * - "OSM": importada de OpenStreetMap (Overpass, admin boundaries) con confirmacion manual.
 * - "Manual": dibujada/editada a mano en el frontend.
 */
export type OrigenGeometriaLocalidad = "OSM" | "Manual";

export interface ILocalidad {
  _id?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;

  nombre?: string;

  /**
   * Geografia de la Localidad (INSIDEht 2.0). La jerarquia UN/CO NO tiene geometria
   * propia: agregan/sectorizan hacia arriba desde las Localidades que contienen.
   * Todos los campos son opcionales (aditivos): una Localidad sin geo se excluye de
   * las metricas/clima por zona.
   */
  ubicacion?: ICoordenadas; // centroide (siempre que haya geo) — usado para consultar clima y centrar mapa
  geojson?: GeoJSON; // poligono opcional de la zona (Polygon / MultiPolygon) — indice 2dsphere en gas-datos
  origenGeometria?: OrigenGeometriaLocalidad;
  osmRelationId?: number; // referencia a la relacion OSM cuando origenGeometria === "OSM"

  // Virtuals
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
}

// CREATE
type OmitirCreate = "_id";
export interface ICreateLocalidad
  extends Omit<Partial<ILocalidad>, OmitirCreate> {}

// UPDATE
type OmitirUpdate = "_id";
export interface IUpdateLocalidad
  extends Omit<Partial<ILocalidad>, OmitirUpdate> {}
