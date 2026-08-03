import { z } from "zod";
import { NotificacionSchema } from "./schema";

export const CreateNotificacionSchema = NotificacionSchema.omit({
  _id: true,
  fechaCreacion: true,
  leido: true,
  fechaLeido: true,
}).required({
  idUsuario: true,
  titulo: true,
  mensaje: true,
});
export type ICreateNotificacion = z.infer<typeof CreateNotificacionSchema>;
