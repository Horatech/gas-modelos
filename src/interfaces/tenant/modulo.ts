import { z } from "zod";

/**
 * Los módulos que se habilitan por cliente (`IConfigCliente.modulos`) y por
 * usuario (`IUsuario.modulos`), con un solo nombre para las dos cosas. Un módulo
 * está habilitado para un usuario cuando el cliente lo tiene activo Y el usuario
 * lo tiene marcado: lo resuelve `capacidadesDe` (`tenant/capacidades.ts`).
 *
 * Hoja: sólo importa zod, así lo pueden importar como valor el cliente y el
 * usuario sin cerrar ciclos.
 */
export const ModuloSchema = z.enum([
  "navegacion",
  "linepack",
  "clima",
  "red",
  "clasificacion",
  "coberturaLorawan",
  "topologia",
]);
export type Modulo = z.infer<typeof ModuloSchema>;

export const MODULOS = ModuloSchema.options;
