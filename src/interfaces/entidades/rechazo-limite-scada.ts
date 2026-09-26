import { z } from "zod";

/**
 * Rechazo de la escritura de un límite de alarma en el SCADA del cliente por un motivo de
 * CONFIGURACIÓN (p. ej. el valor de INSIDEht está fuera del rango del tag en iFix). No es una
 * falla de la integración: es carga u operación de un lado o del otro, y se muestra como una
 * alerta "Error de configuración de límite" por tag y por límite.
 *
 * Archivo hoja: lo usa `alerta.ts` (SCC de IDispositivo) como valor.
 */

/** Límite de alarma de un tag SCADA. */
export const LimiteScadaSchema = z.enum(["HH", "H", "L", "LL"]);
export type LimiteScada = z.infer<typeof LimiteScadaSchema>;

/**
 * Códigos OPC UA que se tratan como error de configuración. El resto de los rechazos son de la
 * integración (comunicación) y cuentan para el estado "Con errores". Ver la clasificación en
 * `PLAN-ESTADO-ONPREMISE.md` § 6.bis: por ahora sólo `BadOutOfRange`, el único visto en producción.
 */
export const CODIGOS_OPC_CONFIGURACION = ["BadOutOfRange"] as const;

export function esRechazoDeConfiguracion(codigo?: string): boolean {
  return !!codigo && (CODIGOS_OPC_CONFIGURACION as readonly string[]).includes(codigo);
}

/** Lo que el adaptador OPC-UA manda a gas-api-integraciones (`POST /integracion/rechazo-limite`). */
export const RechazoLimiteScadaSchema = z.object({
  tag: z.string(),
  limite: LimiteScadaSchema,
  /** Valor de INSIDEht que se intentó escribir. */
  valor: z.number(),
  /** StatusCode de OPC UA (ej. `BadOutOfRange`). */
  codigo: z.string(),
  /** Momento del rechazo según el reloj del adaptador (ISO 8601). */
  fecha: z.string(),
});
export type IRechazoLimiteScada = z.infer<typeof RechazoLimiteScadaSchema>;
