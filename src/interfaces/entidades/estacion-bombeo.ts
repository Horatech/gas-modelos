/**
 * Estación de bombeo (vertical saneamiento): un pozo con sus bombas, telemetrizado
 * por un RTU de campo (hoy Milesight UC300 4G, gas-api-rtu).
 *
 * Cuelga de un punto de medición (`IPuntoMedicion.idEstacionBombeo`), que aporta
 * ubicación, clasificación y estado. La lógica de proceso (alternancia,
 * flotantes, enclavamientos) vive en el tablero del sitio, no en la plataforma.
 */

import { z } from "zod";
import { EstadoCorrectoraSchema } from "./estado";

export const EntradaDigitalRtuSchema = z.enum(["DI1", "DI2", "DI3", "DI4"]);
export type EntradaDigitalRtu = z.infer<typeof EntradaDigitalRtuSchema>;

/**
 * Cómo se manda la bomba desde la plataforma. Lo define el proyectista del
 * tablero; `ninguno` (o ausente) = la bomba sólo se monitorea.
 */
export const ModoMandoBombaSchema = z.enum(["ninguno", "rele", "bus"]);
export type ModoMandoBomba = z.infer<typeof ModoMandoBombaSchema>;

export const BombaSchema = z.object({
  /** Estable: objetivo de los comandos y de las alertas por bomba. */
  _id: z.string().optional(),
  nombre: z.string().optional(),
  /** n de la plantilla: las señales de la bomba son 'b{n}.*'. */
  numero: z.number(),
  /** Esclavo Modbus del variador en el bus RS-485 del RTU. */
  esclavoModbus: z.number().optional(),
  /** Entrada digital cableada a la salida de estado del variador. */
  entradaTestigo: EntradaDigitalRtuSchema.optional(),
  modoMando: ModoMandoBombaSchema.optional(),
});
export type IBomba = z.infer<typeof BombaSchema>;

export const ValorEstadoBombeoSchema = z.object({
  valor: z.union([z.number(), z.boolean()]),
  /** false = el último reporte trajo el valor cacheado, no una lectura fresca. */
  ok: z.boolean(),
  /** ISO. Última lectura fresca (`ok: true`) de esta señal. */
  medidoEn: z.string().optional(),
});
export type IValorEstadoBombeo = z.infer<typeof ValorEstadoBombeoSchema>;

export const EstacionBombeoSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  /**
   * RTU asignado: número de serie del UC300 (16 hex), que es el `deveui` de su
   * IDispositivo. Mismo nombre de campo que el resto de las entidades
   * vinculables: lo asigna y lo libera el proceso de vinculación, no el ABM.
   */
  deveui: z.string().nullable().optional(),
  /** Desde cuándo está asignado el RTU actual. Lo escribe la vinculación. */
  fechaAsignacionDispositivo: z.string().nullable().optional(),
  /** Estado de la estación; lo escriben la vinculación y el cálculo de estado. */
  estadoActual: EstadoCorrectoraSchema.optional(),
  /** Plantilla de canales del RTU ('uc300-3b', 'uc300-2b'). */
  plantilla: z.string().optional(),
  /**
   * Divisor del nivel del pozo (crudo / divisor = metros). Lo fija la puesta en
   * marcha según los decimales del sensor; ausente = el de la plantilla.
   */
  divisorNivel: z.number().optional(),
  /**
   * Nivel del pozo, en metros, a partir del cual se abre la alerta de nivel alto.
   * Es propio de cada pozo: sin valor cargado no se alerta.
   */
  nivelAlarmaM: z.number().optional(),
  bombas: z.array(BombaSchema).optional(),
  // Calculado por el backend a partir de los reportes
  ultimoEstado: z.record(z.string(), ValorEstadoBombeoSchema).optional(),
  timestampUltimoReporte: z.string().nullable().optional(),
  discrepanciasPlantilla: z.array(z.string()).optional(),
  // Tenancy
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
});
export type IEstacionBombeo = z.infer<typeof EstacionBombeoSchema>;

const calculados = {
  _id: true,
  ultimoEstado: true,
  timestampUltimoReporte: true,
  discrepanciasPlantilla: true,
} as const;

export const CreateEstacionBombeoSchema = EstacionBombeoSchema.omit(calculados);
export type ICreateEstacionBombeo = z.infer<typeof CreateEstacionBombeoSchema>;

/** El backend (gas-api-rtu) sí escribe los calculados. */
export const UpdateEstacionBombeoSchema = EstacionBombeoSchema.omit({ _id: true });
export type IUpdateEstacionBombeo = z.infer<typeof UpdateEstacionBombeoSchema>;
