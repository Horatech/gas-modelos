/**
 * Zona de balance: el conjunto de puntos detrás de un **nodo frontera**.
 *
 * El sistema tiene una sola jerarquía —Unidad de Negocio → Centro Operativo →
 * Localidad— y es **organizativa**: dice quién opera el activo. El balance vive en
 * una jerarquía **de red** (qué alimenta a qué) que no coincide con la
 * organizativa: un transformador MT/BT no respeta límites de localidad, y una
 * localidad tiene decenas de transformadores.
 *
 * Que la necesidad ya existe está a la vista: entre los 190 `grupos` de texto
 * libre que cargaron los operadores hay `Cabecera de UN`, `Balance diario`,
 * `Cam. Balance Cinco Saltos` y `COTA PM190`. Vienen construyendo la jerarquía de
 * red dentro de un campo de texto libre porque no había dónde ponerla.
 *
 * Plan: `/PLAN-MODELO-CANONICO-MULTIVERTICAL.md` (F1/F2) · diseño:
 * `/ANALISIS-MODELO-MULTIVERTICAL.md` §4-5.
 *
 * ## Alcance de este incremento
 *
 * Esto es el **árbol de zonas anidadas**, NO el grafo dirigido de la red. Aristas,
 * tramos, longitudes y diámetros quedan fuera a propósito: con el árbol alcanza
 * para que la conservación cierre por nivel, y el grafo no tiene consumidor
 * todavía.
 *
 * ## Por qué `idPuntoFrontera` no tiene populate
 *
 * `punto-medicion.ts` forma parte del SCC de `IDispositivo` (19 archivos con
 * referencias mutuas). Si esta entidad populara `IPuntoMedicion`, entraría al
 * ciclo y habría que degradar a `z.custom` el populate `zonasBalance` del punto.
 * No vale la pena: el nodo frontera se resuelve con una consulta aparte. Ver
 * `gas-modelos/CLAUDE.md`, "De solo tipos a schemas Zod".
 *
 * Por el mismo motivo `zonaPadre` tampoco se popula: sería una autorreferencia que
 * exige `z.lazy` y el árbol lo arma la API en una sola pasada.
 */

import { z } from "zod";
import { CommoditySchema } from "./commodity";
import { NivelRedSchema } from "./clasificacion-punto";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";

/**
 * Cómo se observa el término de almacenamiento de la ecuación de conservación:
 *
 *     Σ entradas − Σ salidas − Σ consumos = ΔAlmacenamiento + Pérdidas
 *
 * Las tres verticales son la misma ecuación; lo que cambia es cómo se observa
 * este término. **Y si es despreciable o no es una decisión por zona/nivel, no un
 * supuesto global**: en baja presión el linepack diario es chico, en un ramal de
 * alta es material.
 *
 * - `medido`: nivel de tanque (agua), estado de carga de batería.
 * - `estimado-desde-estado`: linepack de gas = f(presión, temperatura, volumen
 *   geométrico del tramo). No se mide.
 * - `despreciable`: declarado, no asumido. Es el caso de una red eléctrica sin
 *   almacenamiento.
 */
export const ObservabilidadAlmacenamientoSchema = z.enum([
  "medido",
  "estimado-desde-estado",
  "despreciable",
]);
export type ObservabilidadAlmacenamiento = z.infer<
  typeof ObservabilidadAlmacenamientoSchema
>;

/**
 * Qué pasa con el excedente cuando la inyección de la zona supera su consumo.
 * **Es donde las tres verticales se separan de verdad**: misma estructura de
 * zonas anidadas, comportamiento opuesto.
 *
 * - `bidireccional`: el excedente **sube** al nivel superior. Es el transformador
 *   MT/BT, que es un dispositivo pasivo de acoplamiento magnético y deja pasar
 *   energía en los dos sentidos. Lo que no es simétrico son las protecciones y la
 *   regulación de tensión.
 * - `unidireccional`: el excedente **no puede volver**. Un regulador de presión de
 *   gas es de una sola vía, así que hay que limitar la inyección o almacenarla; en
 *   agua el tanque rebosa, y el rebose es pérdida real en la contabilidad IWA.
 */
export const ReversibilidadFronteraSchema = z.enum([
  "bidireccional",
  "unidireccional",
  "desconocida",
]);
export type ReversibilidadFrontera = z.infer<
  typeof ReversibilidadFronteraSchema
>;

export const ZonaBalanceSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  commodity: CommoditySchema.optional(),
  /** Nivel de red de la zona. El backend valida `codigo` contra `commodity`. */
  nivelRed: NivelRedSchema.optional(),
  /**
   * Zona padre. El **anidamiento** es lo que permite que la conservación cierre
   * por nivel y que el excedente propague sólo cuando corresponde. El backend
   * valida que no haya ciclos.
   */
  idZonaPadre: z.string().nullable().optional(),
  /**
   * El punto que delimita la zona: transformador MT/BT, ERP, estación de bombeo,
   * válvula reductora. Sin populate, a propósito (ver cabecera del archivo).
   */
  idPuntoFrontera: z.string().nullable().optional(),
  reversibilidadFrontera: ReversibilidadFronteraSchema.optional(),
  observabilidadAlmacenamiento: ObservabilidadAlmacenamientoSchema.optional(),
  /**
   * Umbral de inversión, si se conoce: por debajo, la inyección de la zona sólo
   * alivia la carga del nodo frontera y **no se ve aguas arriba**; por encima, el
   * flujo se invierte. Un balance agregado por UN o Localidad no ve la generación
   * distribuida hasta que se cruza. Lo calcula el backend, no se carga a mano.
   */
  umbralInversion: z.number().nullable().optional(),
  fechaCreacion: z.string().optional(),
  // Tenancy: la zona es de red, pero se opera desde una organización
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  // Virtual
  unidadNegocio: UnidadNegocioSchema.optional(),
});
export type IZonaBalance = z.infer<typeof ZonaBalanceSchema>;

const omitir = { _id: true, unidadNegocio: true } as const;

export const CreateZonaBalanceSchema = ZonaBalanceSchema.omit(omitir);
export type ICreateZonaBalance = z.infer<typeof CreateZonaBalanceSchema>;

export const UpdateZonaBalanceSchema = ZonaBalanceSchema.omit(omitir);
export type IUpdateZonaBalance = z.infer<typeof UpdateZonaBalanceSchema>;
