import { z } from "zod";
import type { Modulo } from "../modulo";

/**
 * Qué módulos tiene marcados el usuario. Sólo cuenta si el cliente también tiene
 * el módulo activo (`IConfigCliente.modulos`): ver `capacidadesDe`.
 *
 * Es un `z.object` con una llave por valor de `ModuloSchema` y no un
 * `z.partialRecord`, para que una llave desconocida se descarte (modo strip,
 * como todo lo que viene de Mongoose) en vez de rechazar el documento. El test
 * fija que las llaves sean exactamente las del enum.
 */
export const ModulosUsuarioSchema = z.object({
  navegacion: z.boolean().optional(),
  linepack: z.boolean().optional(),
  clima: z.boolean().optional(),
  red: z.boolean().optional(),
  clasificacion: z.boolean().optional(),
  coberturaLorawan: z.boolean().optional(),
  topologia: z.boolean().optional(),
} as Record<Modulo, z.ZodOptional<z.ZodBoolean>>);
export type IModulosUsuario = z.infer<typeof ModulosUsuarioSchema>;
