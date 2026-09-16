import { z } from "zod";
import { DatosPersonalesSchema } from "./create";
import { NotificacionesSchema } from "./notificacion";
import { PermisoSchema } from "./permiso";
import { TokenPushSchema } from "./token-push";

export const UpdateUsuarioSchema = z.object({
  idCliente: z.string().optional(),
  username: z.string().optional(),
  clave: z.string().optional(),
  hash: z.string().optional(),
  activo: z.boolean().optional(),
  tokensPush: z.array(TokenPushSchema).optional(),
  /** Token único legado (web vieja). Se lee siempre junto a `tokensPush`; no se migra. */
  tokenPush: z.string().optional(),
  datosPersonales: DatosPersonalesSchema.optional(),
  permisos: z.array(PermisoSchema).optional(),
  notificaciones: z.array(NotificacionesSchema).optional(),
});
export type IUpdateUsuario = z.infer<typeof UpdateUsuarioSchema>;
