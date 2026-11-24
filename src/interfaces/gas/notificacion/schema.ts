import { z } from "zod";
import { ReglaAvisoSchema } from "../../entidades/aviso-enviado";

export const NotificacionSchema = z.object({
  _id: z.string().optional(),
  idUsuario: z.string().optional(),
  fechaCreacion: z.string().optional(),
  titulo: z.string().optional(),
  mensaje: z.string().optional(),
  leido: z.boolean().optional(),
  fechaLeido: z.string().optional(),
  // Deep link. Presentes cuando la notificación la creó gas-notificaciones
  // a partir de una alerta; ausentes en las viejas.
  tipoAlerta: z.string().optional(),
  idPuntoMedicion: z.string().optional(),
  idAlerta: z.string().optional(),
  idCliente: z.string().optional(),
  origen: z.string().optional(),
  reglas: z.array(ReglaAvisoSchema).optional(),
  idTarea: z.string().optional(),
  eliminada: z.boolean().optional(),
  fechaEliminada: z.string().optional(),
});
export type INotificacion = z.infer<typeof NotificacionSchema>;
