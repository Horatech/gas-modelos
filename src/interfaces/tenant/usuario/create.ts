import { z } from "zod";
import { PermisoSchema } from "./permiso";

export const DatosPersonalesSchema = z
  .object({
    nombre: z.string().optional(),
    email: z.string().optional(),
    telefono: z.string().optional(),
  })
  .catchall(z.any());
export type IDatosPersonales = z.infer<typeof DatosPersonalesSchema>;

export const CreateUsuarioSchema = z.object({
  idCliente: z.string().optional(),
  username: z.string(),
  clave: z.string().optional(),
  hash: z.string().optional(),
  datosPersonales: DatosPersonalesSchema.optional(),
  permisos: z.array(PermisoSchema),
});
export type ICreateUsuario = z.infer<typeof CreateUsuarioSchema>;
