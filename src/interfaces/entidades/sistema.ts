/**
 * Sistema de red: el conjunto que se opera junto (San Martín Tramo Final,
 * Cordillerano-Patagónico…) y sus subsistemas (`037 - Atlántica`).
 *
 * Una sola entidad, **anidable** por `idSistemaPadre`: la profundidad no se fija
 * (etapa 2 § 4.1) y Cordillerano ya trae un tercer nivel (`088` → `088113`).
 * Separada de `ZonaBalance`: el sistema es agrupación operativa; la zona, de
 * conservación. Sin `idUnidadNegocio`: el sistema cruza unidades de negocio.
 *
 * Campos planos a propósito: los filtros sobre subdocumentos en Mongo se
 * complican. Diseño: gas-insideht-doc,
 * `docs/superpowers/specs/2026-10-13-sistemas-red-design.md`.
 */

import { z } from "zod";
import { CommoditySchema } from "./commodity";

/** De dónde salió el documento. Lo comparten sistema, nodo y tramo. */
export const OrigenRedSchema = z.enum(["importado", "manual"]);
export type OrigenRed = z.infer<typeof OrigenRedSchema>;

/**
 * Qué GIS trajo el caño o el nodo, o qué corrida el tramo de linepack. Donde el
 * proveedor de linepack modela un sistema, su GIS reemplaza al del cliente.
 * Ausente en caños y nodos = `gis` (lo importado antes de este campo).
 */
export const FuenteRedSchema = z.enum(["aquiom", "gis"]);
export type FuenteRed = z.infer<typeof FuenteRedSchema>;

export const SistemaSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string(),
  /** Código del cliente: `037` en un subsistema. Opcional en la raíz. */
  codigo: z.string().optional(),
  /** `null` o ausente = sistema raíz. El backend valida que no haya ciclos. */
  idSistemaPadre: z.string().nullable().optional(),
  commodity: CommoditySchema,
  origen: OrigenRedSchema,
  fechaCreacion: z.string().optional(),
  idCliente: z.string(),
});
export type ISistema = z.infer<typeof SistemaSchema>;

export const CreateSistemaSchema = SistemaSchema.omit({ _id: true });
export type ICreateSistema = z.infer<typeof CreateSistemaSchema>;

/** Sin `idCliente`: mover un sistema de cliente rompería todas sus referencias. */
export const UpdateSistemaSchema = SistemaSchema.omit({
  _id: true,
  idCliente: true,
}).partial();
export type IUpdateSistema = z.infer<typeof UpdateSistemaSchema>;

/**
 * De dónde salió el `idSistema` de un punto de medición (`punto-medicion.ts`).
 *
 * - `nodo`: el punto está en una estación (a pocos metros de un `NodoRed`) de un
 *   solo subsistema.
 * - `traza`: el punto cae sobre la cañería de un subsistema (regla a diseñar).
 * - `manual`: lo fijó un operador. El recálculo no lo pisa.
 * - `proveedor`: lo asignó el import del proveedor de linepack (el subsistema de
 *   los tramos de los que el punto es extremo). Le gana a `nodo` y `traza`.
 * - `declaracion-cliente`: vino de una planilla del cliente.
 */
export const OrigenSistemaPuntoSchema = z.enum([
  "nodo",
  "traza",
  "manual",
  "proveedor",
  "declaracion-cliente",
]);
export type OrigenSistemaPunto = z.infer<typeof OrigenSistemaPuntoSchema>;

export function esSistemaRaiz(s: Pick<ISistema, "idSistemaPadre">): boolean {
  return !s.idSistemaPadre;
}
