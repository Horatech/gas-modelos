import { z } from "zod";
import { CoordenadasSchema, GeoJSONSchema } from "../auxiliares/coordenadas";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { ClienteSchema } from "../tenant/cliente.model";
import { GridEra5Schema } from "./clima-historico";

/**
 * Origen de la geometria de una Localidad.
 * - "OSM": importada de OpenStreetMap (Overpass, admin boundaries) con confirmacion manual.
 * - "Manual": dibujada/editada a mano en el frontend.
 * - "Puntos": centroide derivado de las ubicaciones de los puntos de medicion de la
 *   Localidad (sin poligono). Se usa cuando OSM no tiene un limite propio de la localidad
 *   (p. ej. pueblos dentro de un partido). Solo setea `ubicacion`, no `geojson`.
 */
export const OrigenGeometriaLocalidadSchema = z.enum(["OSM", "Manual", "Puntos"]);
export type OrigenGeometriaLocalidad = z.infer<typeof OrigenGeometriaLocalidadSchema>;

export const LocalidadSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),

  nombre: z.string().optional(),

  /**
   * Geografia de la Localidad (INSIDEht 2.0). La jerarquia UN/CO NO tiene geometria
   * propia: agregan/sectorizan hacia arriba desde las Localidades que contienen.
   * Todos los campos son opcionales (aditivos): una Localidad sin geo se excluye de
   * las metricas/clima por zona.
   */
  ubicacion: CoordenadasSchema.optional(), // centroide (siempre que haya geo) — usado para consultar clima y centrar mapa
  geojson: GeoJSONSchema.optional(), // poligono opcional de la zona (Polygon / MultiPolygon) — indice 2dsphere en gas-datos
  origenGeometria: OrigenGeometriaLocalidadSchema.optional(),
  osmRelationId: z.number().optional(), // referencia a la relacion OSM cuando origenGeometria === "OSM"

  /**
   * Celda de la grilla ERA5-Land a la que cae el centroide. La resuelve y la escribe
   * `gas-api-clima`; es la clave con la que se busca la serie climatica HISTORICA
   * (grados-dia) de la Localidad. Deriva de `ubicacion`: una Localidad sin centroide
   * no tiene celda y queda fuera del historico hasta que cargue su geografia.
   */
  gridEra5: GridEra5Schema.optional(),

  // Virtuals
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
});
export type ILocalidad = z.infer<typeof LocalidadSchema>;

/**
 * Candidato de geometria para una Localidad, obtenido del import asistido desde
 * OpenStreetMap (Nominatim). El operador elige uno y confirma; la geometria se
 * guarda en la Localidad con origenGeometria = "OSM". Atribucion: datos © OSM (ODbL).
 */
export const CandidatoGeoOsmSchema = z.object({
  nombre: z.string(), // display_name de OSM
  osmId: z.number(),
  osmType: z.string(), // "relation" | "way" | "node"
  ubicacion: CoordenadasSchema, // centroide (lat/lon de OSM)
  geojson: GeoJSONSchema.optional(), // poligono, si OSM lo provee
});
export type ICandidatoGeoOsm = z.infer<typeof CandidatoGeoOsmSchema>;

export const CreateLocalidadSchema = LocalidadSchema.omit({ _id: true });
export type ICreateLocalidad = z.infer<typeof CreateLocalidadSchema>;

export const UpdateLocalidadSchema = LocalidadSchema.omit({ _id: true });
export type IUpdateLocalidad = z.infer<typeof UpdateLocalidadSchema>;
