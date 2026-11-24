import { z } from "zod";
import { RecorridoVistoSchema } from "../../entidades/recorrido-asistente";
import { DatosPersonalesSchema } from "./create";
import { NotificacionesSchema } from "./notificacion";
import { ModulosUsuarioSchema } from "./modulos";
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
  modulos: ModulosUsuarioSchema.optional(),
  /** Cuándo vio el recorrido del asistente, por canal. Sin el campo, no lo vio. */
  recorridoAsistente: RecorridoVistoSchema.optional(),
  notificaciones: z.array(NotificacionesSchema).optional(),
});
export type IUpdateUsuario = z.infer<typeof UpdateUsuarioSchema>;
