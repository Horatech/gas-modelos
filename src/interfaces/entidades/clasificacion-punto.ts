/**
 * Clasificación del punto de medición: **qué es** un punto, en cuatro ejes.
 *
 * El descriptor de canal (`canal-descriptor.ts`) dice si dos VALORES son
 * sumables. Esto dice si dos PUNTOS son comparables. Las dos condiciones son
 * necesarias: el volumen de un city gate y el de un comercio tienen descriptores
 * idénticos y sumarlos es doble conteo.
 *
 * Plan: `/PLAN-MODELO-CANONICO-MULTIVERTICAL.md` (F1) · análisis validado contra
 * producción: `/ANALISIS-CLASIFICACION-PUNTOS.md` (92,4 % del padrón se clasifica
 * sin carga manual) · corrección multi-vertical: `/ANALISIS-MODELO-MULTIVERTICAL.md` §6.
 *
 * ## Esto SÍ es Zod
 *
 * Se persiste en `puntomedicions.clasificacion` y viaja en el body del PATCH de
 * clasificación, así que se valida.
 *
 * ## Retrocompatibilidad
 *
 * Todos los campos son opcionales y el objeto entero es opcional en el punto. Un
 * punto sin clasificación es el estado actual de los 4.467 puntos en producción y
 * sigue funcionando igual: las reglas que consultan la clasificación tratan
 * "ausente" como "no sé", nunca como un valor por defecto.
 */

import { z } from "zod";
import { CommoditySchema } from "./commodity";

/**
 * Rol GENÉRICO del punto en la red. Común a las tres verticales.
 *
 * **Es un CONJUNTO y describe CAPACIDAD ESTRUCTURAL, no sentido instantáneo.**
 * Un usuario con paneles solares es `CONSUMO` de noche y `FUENTE` al mediodía: si
 * el rol fuera un valor único, sería mentira la mitad del día. El sentido de cada
 * lectura lo dice el canal (`flowDirection`), no el punto.
 */
export const RolRedGenericoSchema = z.enum([
  /** Entra commodity al sistema desde afuera (transportista, productor, captación). */
  "FUENTE",
  "TRANSPORTE",
  /** Cambia de nivel: ERP, transformador MT/BT, estación de bombeo. */
  "TRANSFORMACION",
  /** Tanque, batería. En gas el linepack NO es un nodo: es propiedad del tramo. */
  "ALMACENAMIENTO",
  /** Sólo mide o vigila, no entrega. */
  "CONTROL",
  /** Frontera comercial. */
  "ENTREGA",
  "CONSUMO",
]);
export type RolRedGenerico = z.infer<typeof RolRedGenericoSchema>;

/**
 * Nivel de red. **Catálogo por commodity, no un enum de gas.**
 *
 * `orden` es lo que hace implementable la regla "no agregar entre niveles" de
 * forma genérica: permite comparar dos niveles sin conocer el catálogo de la
 * vertical. 1 = lo más arriba de la red.
 *
 * Catálogos vigentes (el backend valida `codigo` contra `commodity`):
 * - gas — `GASODUCTO` (>40 bar, orden 1) · `ALTA` (>4 bar, 2) · `MEDIA` (0,5–4 bar, 3) · `BAJA` (18–28 mbar, 4). NAG-100 §3, defs. 22/25/26/27.
 * - electricidad — `AT` (1) · `MT` (2) · `BT` (3).
 * - agua — `ADUCCION` (1) · `DISTRIBUCION` (2) · `DMA` (3).
 */
export const NivelRedSchema = z.object({
  commodity: CommoditySchema,
  codigo: z.string(),
  orden: z.number(),
});
export type INivelRed = z.infer<typeof NivelRedSchema>;

/**
 * De dónde salió el valor de la clasificación. Sin trazabilidad no se puede
 * auditar ni recomputar, y el operador no tiene forma de saber si puede confiar.
 */
export const OrigenClasificacionSchema = z.enum([
  /** Token de clase del `IScada.tag` (94 % de coincidencia con la declaración del cliente). */
  "tag-opc",
  /** Import del listado del cliente. Única fuente posible de la medición fiscal. */
  "declaracion-cliente",
  /** Los `grupos` que ya venían cargando los operadores. */
  "grupo-operador",
  "patron-nombre",
  /** Presión medida + umbrales NAG-100 (1.227 de 1.261 puntos de división Presión). */
  "presion-medida",
  "consumo-medido",
  /** Clase de trazado NAG-100 §5, desde cartografía abierta. */
  "geo-osm",
  "manual",
]);
export type OrigenClasificacion = z.infer<typeof OrigenClasificacionSchema>;

export const ConfianzaClasificacionSchema = z.enum(["alta", "media", "baja"]);
export type ConfianzaClasificacion = z.infer<
  typeof ConfianzaClasificacionSchema
>;

/**
 * `tipoInstalacion`, `subrol` y `categoriaTarifaria` son `string` con catálogo
 * por commodity validado en el backend, **a propósito**, en lugar de un enum
 * unión de las tres verticales.
 *
 * Motivo: un enum que enumera `TRANSFORMADOR_MT_BT` y `ODORIZADOR` en la misma
 * lista invita a asignar el valor equivocado y el tipo no lo puede impedir. Con
 * catálogo por commodity, asignar un subrol eléctrico a un punto de gas devuelve
 * 400. El segundo motivo es práctico: el catálogo de `categoriaTarifaria` depende
 * de normativa que todavía no tenemos, y un `string` no bloquea el modelo.
 *
 * Catálogos vigentes:
 * - `tipoInstalacion` gas — `ERP`, `LIMITADORA`, `ALIVIO`, `ODORIZADOR`,
 *   `PLANTA_COMPRESORA`, `TRAMPA_SCRAPER`, `FILTRO`, `VALVULA`,
 *   `PLANTA_PROPANO_AIRE`, `PROTECCION_CATODICA`, `CAMARA`, `ACOMETIDA`, `OTRA`.
 * - `subrol` gas — `RECEPCION_TRANSPORTE`, `RECEPCION_PRODUCTOR`,
 *   `MEDICION_FISCAL`, `CABECERA_LOCALIDAD`, `ENTREGA_GRAN_USUARIO`,
 *   `ENTREGA_GNC`, `ENTREGA_SUBDISTRIBUIDORA`, `ENTREGA_USUARIO`,
 *   `INYECCION_BIOMETANO`.
 * - `subrol` electricidad — `SUBESTACION`, `TRANSFORMADOR_MT_BT`, `ALIMENTADOR`,
 *   `ENTREGA_USUARIO`, `USUARIO_GENERADOR`, `ALMACENAMIENTO_BATERIA`.
 * - `subrol` agua — `CAPTACION`, `POTABILIZACION`, `TANQUE`, `BOMBEO`,
 *   `VALVULA_REDUCTORA`, `MACROMEDICION_DMA`, `ENTREGA_USUARIO`.
 */
export const ClasificacionPuntoSchema = z.object({
  /** Eje A — activo físico presente en el sitio. Catálogo por commodity. */
  tipoInstalacion: z.string().optional(),

  /** Eje B — capacidad estructural. Conjunto, no valor único. */
  rolesRed: z.array(RolRedGenericoSchema).optional(),
  /** Subtipo del rol, por vertical. Catálogo por commodity. */
  subrol: z.string().optional(),
  /**
   * El punto puede entregar Y recibir.
   *
   * `false` o ausente ⇒ **una lectura en sentido inverso es una FALLA**, no un
   * dato legítimo. Es donde se apoya el tipo de alerta "Flujo inverso" de gas, y
   * la misma regla sirve para el usuario-generador de electricidad.
   */
  bidireccional: z.boolean().optional(),
  /**
   * Contraparte, cuando el rol es de recepción o entrega a un tercero:
   * `TGS`, `TGN`, `YPF`, `ROCH`, `OILSTONE`, `PAE`. Recuperable del token 0 del
   * tag OPC para 100 de los 105 puntos de transferencia de Camuzzi.
   */
  contraparte: z.string().optional(),

  /** Eje C — nivel de red. */
  nivelRed: NivelRedSchema.optional(),

  /** Eje D — categoría tarifaria. Catálogo pendiente de normativa. */
  categoriaTarifaria: z.string().optional(),

  /**
   * Clase de trazado NAG-100 §5 (1..4), por cantidad de unidades de vivienda en
   * una franja de 400 × 1.600 m. Sólo gas. Auto-computable desde cartografía.
   */
  claseTrazado: z.number().int().min(1).max(4).optional(),

  // ── Trazabilidad ────────────────────────────────────────────────────────
  origen: OrigenClasificacionSchema.optional(),
  confianza: ConfianzaClasificacionSchema.optional(),
  fechaClasificacion: z.string().optional(),
  /**
   * `true` = un operador la fijó a mano. **El clasificador automático NO la
   * pisa.** Sin esto se pierde el trabajo del operador en la corrida siguiente,
   * y con él su confianza en la herramienta.
   */
  bloqueada: z.boolean().optional(),
});
export type IClasificacionPunto = z.infer<typeof ClasificacionPuntoSchema>;

/**
 * ¿Pertenecen dos puntos al mismo grupo de agregación?
 *
 * Es la mitad que le falta a `sumable()` del descriptor. Criterio: mismo nivel de
 * red y mismo rol genérico dominante. Un yacimiento, un ERP y un cliente
 * industrial no se suman ni se promedian entre sí — es lo que produjo el promedio
 * de 39.083 m³/día contra una mediana de 1.621.
 *
 * **Ausencia de clasificación devuelve `false`**: "no sé" no autoriza. Es lo que
 * permite desplegar esto sin cambiar ningún número: mientras nadie esté
 * clasificado, ninguna agregación nueva se habilita.
 */
export function mismoGrupoDeAgregacion(
  a: IClasificacionPunto | undefined,
  b: IClasificacionPunto | undefined,
): boolean {
  if (!a || !b) return false;
  if (!a.nivelRed || !b.nivelRed) return false;
  if (a.nivelRed.commodity !== b.nivelRed.commodity) return false;
  if (a.nivelRed.codigo !== b.nivelRed.codigo) return false;
  const rolesA = a.rolesRed ?? [];
  const rolesB = b.rolesRed ?? [];
  if (rolesA.length === 0 || rolesB.length === 0) return false;
  // Mismo conjunto de roles, sin importar el orden.
  if (rolesA.length !== rolesB.length) return false;
  return rolesA.every((r) => rolesB.includes(r));
}
