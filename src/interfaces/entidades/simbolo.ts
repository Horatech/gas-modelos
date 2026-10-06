/**
 * Símbolo de la biblioteca del unifilar: el dibujo de un código de la guía de
 * simbología de Camuzzi (`ERP-MED`, `GEO-IND`…) para un cliente. Los unifilares
 * lo nombran con `data-tipo` y el visor lo dibuja con `<use>`; el dibujo que
 * trae el SVG queda como respaldo.
 *
 * Diseño: `gas-insideht-doc/docs/superpowers/specs/2026-10-06-simbolos-unifilar-design.md`.
 */
import { z } from "zod";

/** Segmentos en mayúscula unidos por guión. Los tipos de fila del tablero (`PE`, `QI`) no califican. */
export const CODIGO_SIMBOLO = /^[A-Z0-9]+(?:-[A-Z0-9]+)+$/;

/** Una caja en la grilla del símbolo (56×36). */
export const CajaSimboloSchema = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number().positive(),
  h: z.number().positive(),
});
export type ICajaSimbolo = z.infer<typeof CajaSimboloSchema>;

export const SimboloSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string(),
  /** Único por cliente; el mismo valor que el `data-tipo` del SVG. */
  codigo: z.string().regex(CODIGO_SIMBOLO),
  nombre: z.string(),
  /** La de la guía: `INST · ESTACIONES`. */
  categoria: z.string().optional(),
  /** El dibujo en la grilla 56×36, sin `<svg>` alrededor. Colores en atributos, sin clases. */
  svg: z.string(),
  /** La parte del dibujo que toca los caños: con ella se encaja el símbolo en el diagrama. */
  cuerpo: CajaSimboloSchema,
});
export type ISimbolo = z.infer<typeof SimboloSchema>;

export const CreateSimboloSchema = SimboloSchema.omit({ _id: true });
export type ICreateSimbolo = z.infer<typeof CreateSimboloSchema>;

export const UpdateSimboloSchema = SimboloSchema.omit({
  _id: true,
  idCliente: true,
  codigo: true,
}).partial();
export type IUpdateSimbolo = z.infer<typeof UpdateSimboloSchema>;
