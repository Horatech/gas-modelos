/**
 * Tramo de red: el caño entre dos nodos, con lo que pide el linepack
 * (longitud, diámetro interno, presión de trabajo) y su traza.
 *
 * Es otro grafo que `EnlaceRed`: aquél une puntos de medición y se carga a mano
 * para ramas y zonas; éste une nodos, se importa, y lleva atributos físicos.
 *
 * Un dato faltante queda `null`: no se completa por defecto (etapa 4). Material,
 * espesor, MAPO y rugosidad entran cuando el cálculo hidráulico los pida.
 */

import { z } from "zod";
import { GeoJSONSchema } from "../auxiliares/coordenadas";
import { OrigenRedSchema } from "./sistema";

/** El `d_TdTrm` del GIS. */
export const TipoTramoSchema = z.enum(["Cañería", "Loop", "Troncal", "Servicio"]);
export type TipoTramo = z.infer<typeof TipoTramoSchema>;

export const TramoRedSchema = z.object({
  _id: z.string().optional(),
  /** `037-001`. Único por cliente: es la clave del re-import. */
  codigo: z.string(),
  /** El nivel más bajo que declara la fuente; si no declara ninguno, la raíz. */
  idSistema: z.string(),
  /** `desde` alimenta a `hasta`, igual que en `EnlaceRed`. */
  idNodoDesde: z.string(),
  idNodoHasta: z.string(),
  tipo: TipoTramoSchema.optional(),
  longitudM: z.number().nullable().optional(),
  diametroInternoM: z.number().nullable().optional(),
  /** Bar relativo, como el proveedor. */
  presionTrabajoBar: z.number().nullable().optional(),
  /** LineString, `[lng, lat]`. Índice 2dsphere en el backend. */
  geojson: GeoJSONSchema.optional(),
  origen: OrigenRedSchema,
  fechaCreacion: z.string().optional(),
  idCliente: z.string(),
});
export type ITramoRed = z.infer<typeof TramoRedSchema>;

export const CreateTramoRedSchema = TramoRedSchema.omit({ _id: true });
export type ICreateTramoRed = z.infer<typeof CreateTramoRedSchema>;

export const UpdateTramoRedSchema = TramoRedSchema.omit({
  _id: true,
  idCliente: true,
}).partial();
export type IUpdateTramoRed = z.infer<typeof UpdateTramoRedSchema>;

/** Los dos extremos en el mismo nodo: no es un tramo, y rompe cualquier recorrido. */
export function esTramoBucle(
  t: Pick<ITramoRed, "idNodoDesde" | "idNodoHasta">,
): boolean {
  return String(t.idNodoDesde) === String(t.idNodoHasta);
}
