// Indicadores de Unidad de Negocio.
//
// Una fila de estas es lo que consumen las dos salidas del mismo cálculo: el
// tablero de inicio (JSON) y la hoja `Indicadores` del Excel. El cálculo vive
// una sola vez, en gas-datos; acá sólo viaja la forma del resultado.
//
// El catálogo de indicadores NO tiene tipos propios: reusa
// `ICatalogoExport` / `IColumnaExportDescriptor` de `./index`, con `grupo` como
// bloque y con `formula`/`universo`/`fuente` completos. Los valores del catálogo
// viven en gas-datos, igual que los del padrón.

import { z } from "zod";
import { EstadoCorrectoraSchema } from "../../entidades/estado";

// Los 9 estados de `IEstado` más el balde de los puntos que no tienen estado
// calculado. El export anterior contaba 8 y `Total Puntos` no cerraba contra el
// detalle: faltaba `Sin Comunicación` y no había dónde poner a los sin estado.
export const EstadoIndicadorSchema = z.union([
  EstadoCorrectoraSchema,
  z.literal("Sin Estado"),
]);
export type EstadoIndicador = z.infer<typeof EstadoIndicadorSchema>;

export const BloqueIndicadorSchema = z.enum([
  "estructura",
  "padron",
  "equipamiento",
  "ratios",
]);
export type BloqueIndicador = z.infer<typeof BloqueIndicadorSchema>;

export const RatioIndicadorSchema = z.enum([
  // Equipos vinculados a un punto sobre el stock de equipos de la unidad.
  // "¿Cuánto de lo que tengo está puesto?"
  "equiposInstalados",
  // Puntos con equipo sobre puntos vigentes.
  // "¿Cuánto del padrón está equipado?"
  "puntosConEquipo",
  // Puntos en funcionamiento sobre puntos con equipo.
  // "¿Cuánto de lo puesto está transmitiendo?"
  "funcionamiento",
]);
export type RatioIndicador = z.infer<typeof RatioIndicadorSchema>;

/**
 * Un ratio no se publica solo: viaja con la aritmética que lo produce, para que
 * dividir las dos columnas del Excel dé exactamente la celda del porcentaje.
 * `valor` es una fracción (0..1), no un entero de 0 a 100: el formato es
 * responsabilidad de quien lo muestra.
 *
 * `valor` es `null` —no 0— cuando el denominador es 0. Son cosas distintas: una
 * unidad sin un solo equipo cargado no tiene 0 % de instalación, no tiene
 * porcentaje.
 */
export const ValorRatioIndicadorSchema = z.object({
  valor: z.number().nullable(),
  numerador: z.number(),
  denominador: z.number(),
});
export type IValorRatioIndicador = z.infer<typeof ValorRatioIndicadorSchema>;

export const FilaIndicadoresUNSchema = z.object({
  /**
   * `null` en la fila "Sin Unidad de Negocio" y en la fila de totales; los
   * puntos sin unidad asignada existen y el export anterior los descartaba.
   */
  idUnidadNegocio: z.string().nullable(),
  /** Nombre de la unidad, "Sin Unidad de Negocio" o "TOTALES". */
  unidadNegocio: z.string(),
  /** Presente sólo en las filas del desglose por división. */
  division: z.string().optional(),
  /**
   * Marca la fila de totales. Sus ratios se recalculan sobre los acumulados, no
   * se promedian: promediar los porcentajes de cada unidad le da a una unidad
   * chica el mismo peso que a una grande (Simpson), que es lo que hacía el
   * export anterior.
   */
  esTotal: z.boolean().optional(),

  // Bloque `estructura`. No se filtran por división: ni la cuenca ni el centro
  // operativo tienen ese atributo.
  centrosOperativos: z.number(),
  cuencas: z.number(),

  // Bloque `padron`. Invariante: `totalPuntos === Σ porEstado`.
  //
  // El record con clave de enum es EXHAUSTIVO en zod: exige las diez claves,
  // aunque valgan 0. Es a propósito — la forma del tipo es la que impide que
  // vuelva a faltar un balde y que `Total Puntos` no cierre contra el detalle.
  totalPuntos: z.number(),
  porEstado: z.record(EstadoIndicadorSchema, z.number()),

  // Bloque `equipamiento`, todo en conteos crudos.
  /** Puntos con `estado !== "Dado de Baja"`. */
  puntosVigentes: z.number(),
  /** Puntos vigentes con al menos un equipo vinculado. */
  puntosConEquipo: z.number(),
  /** Puntos en `Operativa`, `Incompleto` o `Alerta`. */
  puntosEnFuncionamiento: z.number(),
  /** Stock de la unidad: dispositivos + SCADA. Incluye los que no están puestos. */
  equiposDisponibles: z.number(),
  /** Del stock, los que están asignados a un punto vigente. */
  equiposVinculados: z.number(),

  // Bloque `ratios`. Exhaustivo por el mismo motivo: los tres salen siempre, y
  // el que no tiene denominador sale con `valor: null`, no ausente.
  ratios: z.record(RatioIndicadorSchema, ValorRatioIndicadorSchema),
});
export type IFilaIndicadoresUN = z.infer<typeof FilaIndicadoresUNSchema>;

/**
 * Lo que devuelve el cálculo. `desgloseDivision` sale sólo si se pide: es lo que
 * reemplaza a la rama `tradicionales/scada/todo` del export anterior, que
 * cambiaba el significado de cuatro columnas según el filtro sin registrarlo en
 * ninguna parte.
 */
export const ResultadoIndicadoresUNSchema = z.object({
  filas: z.array(FilaIndicadoresUNSchema),
  desgloseDivision: z.array(FilaIndicadoresUNSchema).optional(),
  /** Equipos cuyo `deveui` no resolvió contra el stock; se declara, no se descarta. */
  equiposSinResolver: z.number().optional(),
  /** ISO 8601 del momento del cálculo. */
  calculadoEn: z.string(),
});
export type IResultadoIndicadoresUN = z.infer<
  typeof ResultadoIndicadoresUNSchema
>;
