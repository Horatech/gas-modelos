/**
 * Enlace de red: la arista que dice **qué punto alimenta a qué punto**.
 *
 * La clasificación dice qué ES un punto ([clasificacion-punto.ts]) y la zona de
 * balance dice a qué conjunto pertenece ([zona-balance.ts]). Ninguna de las dos
 * dice qué alimenta a qué, y sin eso no se puede seguir una rama de la red desde
 * su cabecera hasta sus puntas — que es la condición para calcular consumo e
 * inyección.
 *
 * Diseño: `docs/11-tablero-operaciones/16-topologia-red.md` (Fase 4c).
 *
 * ## Cinco decisiones que explican la forma de esta entidad
 *
 * 1. **La carga es manual.** A diferencia de la clasificación —que está latente en
 *    el tag OPC, en el grupo del operador y en la presión medida—, quién alimenta
 *    a quién NO está en los datos. No hay clasificador posible: el nombre no
 *    alcanza. De ahí que `origen` no tenga valor automático.
 * 2. **Se permiten anillos.** La red mallada de media presión es real. Prohibirlos
 *    en la validación y descubrirlos después sería migrar aristas ya cargadas a
 *    mano. La protección contra recorridos patológicos vive en el recorrido
 *    (profundidad máxima + dedupe), no en el alta.
 * 3. **El estado no es metadato.** En un mallado la topología EFECTIVA es el
 *    estado de las válvulas: el mismo anillo alimenta desde un lado o del otro
 *    según qué esté cerrado. Sin el estado, "la rama" no tiene una respuesta hoy.
 * 4. **Todo extremo es un punto de medición.** Una válvula es un punto con su
 *    `tipoInstalacion`, con dispositivo adentro o sin nada. No hay entidad de nodo
 *    pasivo: obligaría a cargar a mano cosas que no reportan nada.
 * 5. **Es una colección, no un array embebido en el punto.** Un ERP con 30 salidas
 *    serían 30 escrituras al mismo documento, la arista tiene atributos con su
 *    propio ciclo de vida, y el recorrido no toca `puntomedicions`, que es la
 *    colección grande y caliente del sistema.
 *
 * ## Sin populate de los puntos, a propósito
 *
 * `punto-medicion.ts` es parte del SCC de `IDispositivo` (19 archivos con
 * referencias mutuas). Si esta entidad populara `IPuntoMedicion` entraría al
 * ciclo. Es el mismo motivo por el que `zona-balance.ts` deja `idPuntoFrontera`
 * sin populate: los puntos los resuelve el recorrido en una consulta aparte.
 */

import { z } from "zod";
import { CommoditySchema } from "./commodity";
import { ConfianzaClasificacionSchema } from "./clasificacion-punto";

/**
 * `dirigido`: `desde` alimenta a `hasta`, y nada más.
 * `bidireccional`: el flujo puede ir para los dos lados, así que el recorrido
 * entra por cualquiera de los dos extremos. Es el caso del anillo entre puntos
 * del mismo nivel de presión.
 */
export const SentidoEnlaceSchema = z.enum(["dirigido", "bidireccional"]);
export type SentidoEnlace = z.infer<typeof SentidoEnlaceSchema>;

export const ValorEstadoEnlaceSchema = z.enum([
  "abierto",
  "cerrado",
  "desconocido",
]);
export type ValorEstadoEnlace = z.infer<typeof ValorEstadoEnlaceSchema>;

/**
 * Estado del enlace. Puede venir declarado por el operario o **ligado al canal**
 * de un punto que lo reporta (una válvula con telemetría SCADA): si hay
 * `canalRef`, `valor` es el último estado resuelto y `fecha` dice de cuándo.
 *
 * No hay suscripción viva: el estado se resuelve en lectura.
 */
export const EstadoEnlaceSchema = z.object({
  valor: ValorEstadoEnlaceSchema,
  /** `<origen>/<perfil>#<selector>` — ver `canalRef()` en `perfil-lectura.ts`. */
  canalRef: z.string().optional(),
  /** El punto-válvula que reporta el estado. */
  idPuntoEstado: z.string().optional(),
  fecha: z.string().optional(),
});
export type IEstadoEnlace = z.infer<typeof EstadoEnlaceSchema>;

/**
 * De dónde salió la arista. No incluye ningún valor automático porque no hay
 * inferencia posible: `importado` es "vino de un archivo del cliente", no
 * "lo dedujo el sistema".
 */
export const OrigenEnlaceSchema = z.enum([
  "manual",
  "declaracion-cliente",
  "importado",
]);
export type OrigenEnlace = z.infer<typeof OrigenEnlaceSchema>;

export const EnlaceRedSchema = z.object({
  _id: z.string().optional(),
  /** `desde` alimenta a `hasta`. Si `sentido` es bidireccional, en ambos sentidos. */
  idPuntoDesde: z.string(),
  idPuntoHasta: z.string(),
  sentido: SentidoEnlaceSchema,
  /** Tiene que coincidir con el de los dos puntos. Lo valida el backend. */
  commodity: CommoditySchema,
  estado: EstadoEnlaceSchema.optional(),
  // ── Trazabilidad, igual que la clasificación: de dónde salió y con qué confianza
  origen: OrigenEnlaceSchema,
  confianza: ConfianzaClasificacionSchema.optional(),
  idUsuario: z.string().optional(),
  fechaCreacion: z.string().optional(),
  notas: z.string().optional(),
  // Tenancy
  idCliente: z.string(),
  idUnidadNegocio: z.string().optional(),
});
export type IEnlaceRed = z.infer<typeof EnlaceRedSchema>;

const omitir = { _id: true } as const;

export const CreateEnlaceRedSchema = EnlaceRedSchema.omit(omitir);
export type ICreateEnlaceRed = z.infer<typeof CreateEnlaceRedSchema>;

/**
 * Todo opcional: se corrige un sentido o un estado sin reenviar la arista entera.
 * Los dos extremos también son editables — un operario que cargó mal el punto
 * tiene que poder arreglarlo sin borrar y recrear.
 */
export const UpdateEnlaceRedSchema = EnlaceRedSchema.omit(omitir).partial();
export type IUpdateEnlaceRed = z.infer<typeof UpdateEnlaceRedSchema>;

// ── Predicados ─────────────────────────────────────────────────────────────
// Viven acá y no en el backend porque son la definición del modelo, no una
// decisión de un servicio: si el recorrido de gas-datos y una vista futura los
// implementaran por separado, se van a desincronizar.

/**
 * Aristas dirigidas que aporta el enlace. Un bidireccional aporta las dos, y eso
 * es lo que le permite al recorrido entrar a un anillo por cualquier extremo.
 */
export function orientacionesDe(e: IEnlaceRed): [string, string][] {
  const directa: [string, string] = [
    String(e.idPuntoDesde),
    String(e.idPuntoHasta),
  ];
  if (e.sentido !== "bidireccional") return [directa];
  return [directa, [String(e.idPuntoHasta), String(e.idPuntoDesde)]];
}

/**
 * `false` sólo si el estado dice `cerrado`.
 *
 * **`desconocido` y la ausencia de estado cuentan como abierto.** La mayoría de
 * las aristas se van a cargar sin estado, y tratar la falta de dato como válvula
 * cerrada dejaría el grafo vacío justo mientras se está poblando — el mismo
 * criterio de "declarado, no asumido" que usa `observabilidadAlmacenamiento`,
 * leído para el lado que no rompe.
 */
export function enlaceAbierto(e: IEnlaceRed): boolean {
  return e.estado?.valor !== "cerrado";
}

/** Arista de un punto a sí mismo: no significa nada y rompe el recorrido. */
export function esBucle(e: IEnlaceRed): boolean {
  return String(e.idPuntoDesde) === String(e.idPuntoHasta);
}
