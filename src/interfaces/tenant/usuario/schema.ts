import { z } from "zod";
import { ClienteSchema } from "../cliente.model";
import { DatosPersonalesSchema } from "./create";
import { NotificacionesSchema } from "./notificacion";
import { PermisoSchema } from "./permiso";
import { TokenPushSchema } from "./token-push";

export const UsuarioSchema = z.object({
  _id: z.string().optional(),
  username: z.string().optional(),
  hash: z.string().optional(),
  idCliente: z.string().optional(),
  activo: z.boolean().optional(),
  fechaCreacion: z.string().optional(),
  permisos: z.array(PermisoSchema).optional(),
  datosPersonales: DatosPersonalesSchema.optional(),
  notificaciones: z.array(NotificacionesSchema).optional(),
  tokensPush: z.array(TokenPushSchema).optional(),
  /** @deprecated un solo token por usuario. Leer como fallback hasta que corra migrar-token-push. */
  tokenPush: z.string().optional(),
  fecha_activacion_whatsapp: z.string().optional(),
  // Virtuals
  cliente: ClienteSchema.optional(),
});
export type IUsuario = z.infer<typeof UsuarioSchema>;
