/**
 * Nodo de la navegación configurable: una carpeta o una entrada del árbol desde
 * el que el operador llega a las vistas de operación.
 *
 * Diseño: `gas-insideht-doc/docs/superpowers/specs/2026-09-24-navegacion-configurable-design.md`.
 *
 * - **Es dato, no código.** La navegación del Operation Hub no sigue un solo eje
 *   (en la misma lista hay balances, estaciones, gasoductos y sistemas) y puede
 *   cambiar; cada cambio no puede ser un PR.
 * - **Colección, no árbol embebido.** El recorte por permisos se hace en la
 *   consulta, y mover un nodo toca sólo ese documento.
 * - **La visibilidad sale del alcance del nodo** (UN/CO), no del destino: el
 *   destino de una entrada todavía es un placeholder.
 */

import { z } from "zod";

export const TipoNodoNavegacionSchema = z.enum(["carpeta", "entrada"]);
export type TipoNodoNavegacion = z.infer<typeof TipoNodoNavegacionSchema>;

/** De qué página del sistema anterior salió el nodo. Sólo en la carga inicial. */
export const OrigenNodoNavegacionSchema = z.object({
  sistema: z.literal("operationhub"),
  app: z.string(),
  pageId: z.string().optional(),
});
export type IOrigenNodoNavegacion = z.infer<typeof OrigenNodoNavegacionSchema>;

export const NodoNavegacionSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string(),
  /** `null` o ausente en la raíz. */
  idPadre: z.string().nullable().optional(),
  /** Orden entre hermanos. */
  orden: z.number(),
  nombre: z.string(),
  /** Una `entrada` no tiene hijos. No se edita: se borra y se crea. */
  tipo: TipoNodoNavegacionSchema,
  /** Alcance. Sin UN ni CO, el nodo lo ven sólo los usuarios globales. */
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  /** Qué abre la entrada. Sin forma fija hasta que lo defina la tarea del destino. */
  destino: z.record(z.string(), z.unknown()).optional(),
  origen: OrigenNodoNavegacionSchema.optional(),
  fechaCreacion: z.string().optional(),
});
export type INodoNavegacion = z.infer<typeof NodoNavegacionSchema>;

export const CreateNodoNavegacionSchema = NodoNavegacionSchema.omit({
  _id: true,
});
export type ICreateNodoNavegacion = z.infer<typeof CreateNodoNavegacionSchema>;

export const UpdateNodoNavegacionSchema = NodoNavegacionSchema.omit({
  _id: true,
  idCliente: true,
  tipo: true,
}).partial();
export type IUpdateNodoNavegacion = z.infer<typeof UpdateNodoNavegacionSchema>;

/** El orden completo de los hijos de una carpeta, después de un drag & drop. */
export const OrdenNodosNavegacionSchema = z.object({
  idPadre: z.string().nullable(),
  ids: z.array(z.string()),
});
export type IOrdenNodosNavegacion = z.infer<typeof OrdenNodosNavegacionSchema>;

export type INodoArbol = INodoNavegacion & { hijos: INodoArbol[] };

// ── Funciones del árbol ────────────────────────────────────────────────────
// Viven acá porque son la definición del modelo: gas-api-cliente arma con ellas
// el árbol de cada usuario y valida los movimientos, y gas-datos borra en
// cascada. Implementadas por separado se desincronizan.

const clave = (id: unknown): string | null =>
  id === null || id === undefined ? null : String(id);

function porPadre<T extends Pick<INodoNavegacion, "_id" | "idPadre">>(
  nodos: T[],
): Map<string | null, T[]> {
  const mapa = new Map<string | null, T[]>();
  for (const n of nodos) {
    const k = clave(n.idPadre);
    const lista = mapa.get(k);
    if (lista) lista.push(n);
    else mapa.set(k, [n]);
  }
  return mapa;
}

/**
 * Arma el árbol desde la raíz (`idPadre` nulo).
 *
 * - Un nodo cuyo padre no está en `nodos` no aparece: no sube a la raíz, porque
 *   la estructura no puede cambiar según quién mire.
 * - Los hijos de una `entrada` se ignoran.
 * - Con `podar` (el default), una carpeta sin ninguna entrada debajo no se
 *   devuelve. El editor pide `podar: false` para ver las carpetas vacías.
 * - Termina aunque los datos tengan un ciclo: un ciclo no es alcanzable desde
 *   la raíz, porque cada nodo tiene un solo padre.
 */
export function armarArbol(
  nodos: INodoNavegacion[],
  opciones: { podar?: boolean } = {},
): INodoArbol[] {
  const podar = opciones.podar ?? true;
  const hijosDe = porPadre(nodos);
  const armar = (idPadre: string | null): INodoArbol[] =>
    [...(hijosDe.get(idPadre) ?? [])]
      .sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre))
      .map((n) => ({
        ...n,
        hijos: n.tipo === "carpeta" ? armar(String(n._id)) : [],
      }))
      .filter((n) => !podar || n.tipo === "entrada" || n.hijos.length > 0);
  return armar(null);
}

/** Todos los nodos debajo de `id`, sin incluirlo. Termina aunque haya un ciclo. */
export function descendientesDe(
  nodos: Pick<INodoNavegacion, "_id" | "idPadre">[],
  id: string,
): Set<string> {
  const hijosDe = porPadre(nodos);
  const vistos = new Set<string>();
  const pendientes = [String(id)];
  while (pendientes.length) {
    const actual = pendientes.pop() as string;
    for (const h of hijosDe.get(actual) ?? []) {
      const k = String(h._id);
      if (k === String(id) || vistos.has(k)) continue;
      vistos.add(k);
      pendientes.push(k);
    }
  }
  return vistos;
}
