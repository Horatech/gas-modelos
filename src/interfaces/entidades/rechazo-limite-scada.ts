import { z } from "zod";

/**
 * Rechazo de la escritura de un límite de alarma en el SCADA del cliente por un motivo POR TAG
 * (configuración u operación: fuera de rango, nodo inexistente, sin permiso, error de
 * configuración en iFix). No es una falla de la integración: es carga u operación de un lado o
 * del otro, y se muestra como una alerta "Error de configuración de límite" por tag y por límite.
 *
 * Archivo hoja: lo usa `alerta.ts` (SCC de IDispositivo) como valor.
 */

/** Límite de alarma de un tag SCADA. */
export const LimiteScadaSchema = z.enum(["HH", "H", "L", "LL"]);
export type LimiteScada = z.infer<typeof LimiteScadaSchema>;

/**
 * Clasificación de un rechazo OPC UA (StatusCode `Bad*` o excepción) en dos clases:
 *
 * - **Integración**: el adaptador no pudo hablar con el servidor: transporte, canal seguro, sesión,
 *   timeouts, servidor caído, credenciales. Cuenta para el estado "Con errores" del puente.
 * - **Por tag (configuración u operación)**: el servidor contestó y dijo que no a ESE pedido:
 *   valor fuera de rango, nodo inexistente, sin permiso de escritura, error de configuración del
 *   tag en iFix, etc. Es carga u operación de un lado o del otro, no salud de la integración: se
 *   muestra como alerta "Error de configuración de límite" por tag y por límite y no toca el puente.
 *
 * La regla es por lista cerrada de códigos de INTEGRACIÓN: todo lo que el servidor devuelve como
 * respuesta a una operación es por tag, porque una respuesta `Bad` es justamente prueba de que la
 * comunicación funciona. Un rechazo sin código (excepción sin StatusCode) es de integración.
 * Decidido el 26-oct-2026 (antes la lista cerrada era la de configuración, con sólo `BadOutOfRange`
 * y `BadNodeIdUnknown`, y `BadConfigurationError`, `BadUnexpectedError` o `BadUserAccessDenied` de
 * un tag mal cargado ponían el puente "Con errores"). Ver `PLAN-ESTADO-ONPREMISE.md` § 6.bis.
 */
export const CODIGOS_OPC_INTEGRACION = [
  "BadTimeout",
  "BadRequestTimeout",
  "BadRequestInterrupted",
  "BadCommunicationError",
  "BadNoCommunication",
  "BadConnectionClosed",
  "BadConnectionRejected",
  "BadDisconnect",
  "BadTooManySessions",
  "BadIdentityTokenRejected",
  "BadIdentityTokenInvalid",
  "BadTcpServerTooBusy",
  "BadTcpEndpointUrlInvalid",
  "BadServiceUnsupported",
] as const;

/** Familias enteras de códigos de integración (canal seguro, sesión, servidor, suscripción). */
export const PREFIJOS_OPC_INTEGRACION = [
  "BadSecureChannel",
  "BadSession",
  "BadServer",
  "BadSubscription",
  "BadShutdown",
  "BadSecurity",
  "BadCertificate",
] as const;

/** Rechazo que habla de la comunicación con el servidor, no de un tag. Sin código, también. */
export function esRechazoDeIntegracion(codigo?: string): boolean {
  if (!codigo) return true;
  if ((CODIGOS_OPC_INTEGRACION as readonly string[]).includes(codigo)) return true;
  return PREFIJOS_OPC_INTEGRACION.some((p) => codigo.startsWith(p));
}

/**
 * Rechazo por tag: el servidor contestó y rechazó ese pedido. Se mantiene el nombre histórico
 * ("de configuración") porque es el que usan el adaptador y la alerta.
 */
export function esRechazoDeConfiguracion(codigo?: string): boolean {
  return !!codigo && !esRechazoDeIntegracion(codigo);
}

/** Lo que el adaptador OPC-UA manda a gas-api-integraciones (`POST /integracion/rechazo-limite`). */
export const RechazoLimiteScadaSchema = z.object({
  tag: z.string(),
  limite: LimiteScadaSchema,
  /** Valor de INSIDEht que se intentó escribir. */
  valor: z.number(),
  /** StatusCode de OPC UA (ej. `BadOutOfRange`, `BadUserAccessDenied`, `BadConfigurationError`). */
  codigo: z.string(),
  /** Momento del rechazo según el reloj del adaptador (ISO 8601). */
  fecha: z.string(),
});
export type IRechazoLimiteScada = z.infer<typeof RechazoLimiteScadaSchema>;
