import { z } from "zod";
import { NotificacionSchema } from "./schema";

export const UpdateNotificacionSchema = NotificacionSchema.omit({
  _id: true,
  idUsuario: true,
  fechaCreacion: true,
  titulo: true,
  mensaje: true,
});
export type IUpdateNotificacion = z.infer<typeof UpdateNotificacionSchema>;
