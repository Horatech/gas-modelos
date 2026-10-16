import { z } from "zod";

/**
 * Módulos habilitados para el usuario. Cada uno se suma al flag del cliente
 * (`config.modulo<X>.activo`): hacen falta los dos. Ausente ⇒ apagado, también
 * para el administrador global.
 *
 * Los permisos sobre UN/CO/Localidad deciden qué ve el usuario dentro del
 * módulo; esto decide si entra. Se editan desde web-admin.
 */
export const ModulosUsuarioSchema = z.object({
  /** Operación (navegación, tablas, unifilares, históricos). Con `config.moduloNavegacion`. */
  navegacion: z.boolean().optional(),
  /** Linepack, dentro de Operación. Con `config.moduloLinepack` y `navegacion`. */
  linepack: z.boolean().optional(),
  /** Clima. Con `config.moduloClima`. Temporal: sólo lo mira el front. */
  clima: z.boolean().optional(),
});
export type IModulosUsuario = z.infer<typeof ModulosUsuarioSchema>;
