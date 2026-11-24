/**
 * Recorrido guiado del asistente: los pasos que el chat muestra la primera vez (y cuando el usuario lo pide) para que
 * pruebe cada cosa con sus puntos. Los arma gas-api-cliente; web y app sólo los dibujan.
 *
 * Spec: gas-insideht-doc `docs/superpowers/specs/2026-11-24-horacito-recorrido-design.md`.
 */

import { z } from "zod";
import type { CanalAsistente } from "./tarea-asistente";

/** Dónde se vio el recorrido: la web o la app (android e ios tienen los mismos pasos). */
export const CanalRecorridoAsistenteSchema = z.enum(["web", "app"]);
export type CanalRecorridoAsistente = z.infer<typeof CanalRecorridoAsistenteSchema>;

export function canalRecorridoAsistente(canal: CanalAsistente): CanalRecorridoAsistente {
  return canal === "web" ? "web" : "app";
}

/** Cuándo vio el usuario el recorrido, por canal (ISO 8601). Sin el campo, no lo vio. */
export const RecorridoVistoSchema = z.object({
  web: z.string().optional(),
  app: z.string().optional(),
});
export type IRecorridoVisto = z.infer<typeof RecorridoVistoSchema>;

export const TipoPasoRecorridoSchema = z.enum([
  "puntos",
  "valor",
  "serie",
  "registros",
  "seguimiento",
  "mapa",
  "tarea",
  "ayuda",
  "libre",
]);
export type TipoPasoRecorrido = z.infer<typeof TipoPasoRecorridoSchema>;

export interface IPasoRecorridoAsistente {
  id: TipoPasoRecorrido;
  titulo: string;
  /** Lo que el paso enseña, en una línea. */
  aprendes: string;
  /** La pregunta que manda "Probalo"; sin ella, el paso no tiene botón. */
  pregunta?: string;
}

export interface IRecorridoAsistente {
  visto: boolean;
  pasos: IPasoRecorridoAsistente[];
}
