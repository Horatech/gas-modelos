import { z } from "zod";
import { DatosPersonalesSchema } from "./create";
import { NotificacionesSchema } from "./notificacion";
import { PermisoSchema } from "./permiso";

export const UpdateUsuarioSchema = z.object({
  idCliente: z.string().optional(),
  username: z.string().optional(),
  clave: z.string().optional(),
  hash: z.string().optional(),
  activo: z.boolean().optional(),
  tokenPush: z.string().optional(),
  datosPersonales: DatosPersonalesSchema.optional(),
  permisos: z.array(PermisoSchema).optional(),
  notificaciones: z.array(NotificacionesSchema).optional(),
});
export type IUpdateUsuario = z.infer<typeof UpdateUsuarioSchema>;
