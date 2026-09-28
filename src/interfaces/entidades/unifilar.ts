/**
 * Unifilar: el diagrama de un sistema o estación, en el formato del "Editor de
 * Unifilares Camuzzi" (SVG con `tablero-widget` / `metric-row data-tag`).
 *
 * Diseño: `gas-insideht-doc/docs/superpowers/specs/2026-09-28-unifilar-design.md`.
 *
 * - `tags` son los `data-tag` del SVG; los calcula gas-datos al guardar. Con
 *   ellos gas-api-cliente decide quién ve el unifilar y qué valores le manda.
 * - El nodo de la navegación apunta acá con `destino.idUnifilar`: el SVG no va
 *   en el nodo porque el árbol se baja entero.
 */
import { z } from "zod";
import type { IScada } from "./scada";

export const OrigenUnifilarSchema = z.enum(["mimic", "v2"]);
export type OrigenUnifilar = z.infer<typeof OrigenUnifilarSchema>;

export const UnifilarSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string(),
  /** El del mimic del Operation Hub: `BAC_Chillar`, `OPER_LPL_LPL`. Único por cliente. */
  nombre: z.string(),
  origen: OrigenUnifilarSchema,
  svg: z.string(),
  tags: z.array(z.string()).optional(),
  fechaImportacion: z.string().optional(),
});
export type IUnifilar = z.infer<typeof UnifilarSchema>;

export const CreateUnifilarSchema = UnifilarSchema.omit({ _id: true, tags: true });
export type ICreateUnifilar = z.infer<typeof CreateUnifilarSchema>;

export const UpdateUnifilarSchema = UnifilarSchema.omit({
  _id: true,
  idCliente: true,
  tags: true,
}).partial();
export type IUpdateUnifilar = z.infer<typeof UpdateUnifilarSchema>;

/** Lo que devuelve `GET /unifilares/:id/variables`: sólo las variables que el usuario ve. */
export interface IVariablesUnifilar {
  tags: string[];
  variables: IScada[];
}
