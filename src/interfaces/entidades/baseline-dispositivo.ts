import { z } from "zod";

/**
 * ¿El baseline del odómetro (`lecturaInicialDispositivo`) se resolvió contra el
 * instante real de la instalación, o es lo mejor que había a mano?
 *
 * **Ausente se lee como `confirmado`**: es todo el parque anterior a este campo.
 * `provisorio` es lo único que autoriza a la ingesta a re-baselinear, y una sola vez.
 *
 * Existe porque el baseline se congela al vincular, en un instante del que todavía
 * puede no haber dato:
 *
 * - un equipo nuevo nunca reportó, así que el baseline queda en 0 y el odómetro
 *   entero entra al acumulado del medidor;
 * - el WRC manda los 24 registros del día D recién a las ~09:00Z del D+1, así que al
 *   vincular a las 13:00 el último dato disponible es el de las 23:00 de ayer.
 *
 * El dato correcto llega después. Sin esta marca no hay forma de saber a qué medidor
 * volver, y por eso el error de hoy es permanente. Mismo criterio que `tsCorrido` en
 * `IRegistro`: no es un campo informativo, es el discriminante que hace el arreglo
 * idempotente y resumible.
 *
 * Archivo hoja (sólo depende de zod), igual que `estado.ts`: lo necesitan como VALOR
 * los dos medidores residenciales, que son del SCC de `IDispositivo` y no pueden
 * importarse entre sí.
 */
export const EstadoBaselineDispositivoSchema = z.enum([
  "provisorio",
  "confirmado",
]);
export type IEstadoBaselineDispositivo = z.infer<
  typeof EstadoBaselineDispositivoSchema
>;
