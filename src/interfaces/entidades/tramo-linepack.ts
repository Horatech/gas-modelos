/**
 * Tramo de linepack: la unidad sobre la que el proveedor calcula el gas
 * almacenado en la cañería (`088-001-A`), entre dos puntos de medición.
 *
 * **Cuelga de un `EnlaceRed`**, no lo reemplaza: el enlace es la relación PM→PM,
 * válida para cualquier cliente y commodity, y deja afuera a propósito geometría
 * y atributos físicos. Lo que es del cálculo de linepack vive acá. Los extremos
 * son los del enlace (reales o PM virtuales), no se repiten.
 *
 * Se importa del proveedor y se sincroniza (upsert por `codigo`); los valores
 * (P_INICIO, P_FIN, LINEPACK, pronóstico) **no se guardan**: se pegan por
 * `assetId` en lectura, desde el proxy. Diseño: gas-insideht-doc
 * `docs/superpowers/specs/2026-11-10-red-dos-capas-design.md`.
 *
 * Un dato faltante queda `null`: no se completa por defecto.
 */

import { z } from "zod";
import { FuenteRedSchema } from "./sistema";

/**
 * Pedazo de caño del GIS que forma el tramo. `idTramoRed` se resuelve sólo si el
 * caño está cargado en la capa GIS: sin GIS el tramo queda completo igual.
 */
export const ComposicionTramoLinepackSchema = z.object({
  /** `ID_Lic` del caño (`088-001`). */
  codigoCano: z.string(),
  desdeM: z.number(),
  hastaM: z.number(),
  idTramoRed: z.string().nullable().optional(),
});
export type IComposicionTramoLinepack = z.infer<
  typeof ComposicionTramoLinepackSchema
>;

export const TramoLinepackSchema = z.object({
  _id: z.string().optional(),
  /**
   * El enlace PM→PM del que cuelga. Vacío mientras algún extremo no tenga punto
   * de medición: hoy, los nodos virtuales del proveedor, hasta que exista el PM
   * virtual (gas-insideht-doc #345). El re-import lo completa.
   */
  idEnlaceRed: z.string().nullable().optional(),
  /** `088-001-A`. Único por cliente: es la clave del re-import. */
  codigo: z.string(),
  /** `SYS_088_001_A`: con esto se pegan los valores del proveedor. */
  assetId: z.string(),
  idSistema: z.string(),
  longitudM: z.number().nullable().optional(),
  volumenM3: z.number().nullable().optional(),
  diametroInternoM: z.number().nullable().optional(),
  /**
   * Presión de trabajo del caño **en kg/cm², como la publica el proveedor**
   * (`presion_trabajo_kgcm2` de `/api/segmentacion`). No es la unidad de las
   * presiones medidas (bar manométrica): no se convierte para no inventar si es
   * relativa o absoluta.
   */
  presionTrabajoKgcm2: z.number().nullable().optional(),
  /** `transporte`, `alta`, `media`, `desconocido`… Lista abierta: la define el proveedor. */
  regimen: z.string().nullable().optional(),
  linepackSignificativo: z.boolean().nullable().optional(),
  composicion: z.array(ComposicionTramoLinepackSchema).optional(),
  fuente: FuenteRedSchema,
  /** `generado_at` de la corrida del proveedor que trajo este tramo. */
  generadoAt: z.string().optional(),
  fechaCreacion: z.string().optional(),
  idCliente: z.string(),
});
export type ITramoLinepack = z.infer<typeof TramoLinepackSchema>;

export const CreateTramoLinepackSchema = TramoLinepackSchema.omit({
  _id: true,
});
export type ICreateTramoLinepack = z.infer<typeof CreateTramoLinepackSchema>;

export const UpdateTramoLinepackSchema = TramoLinepackSchema.omit({
  _id: true,
  idCliente: true,
}).partial();
export type IUpdateTramoLinepack = z.infer<typeof UpdateTramoLinepackSchema>;
