import { z } from "zod";
import { ReglaAvisoSchema } from "../../entidades/aviso-enviado";

// Definido explícito (no derivado de .omit().required()): ver el comentario
// en gas/auditoria/create.ts — .required() no sobrevive portablemente al
// .d.ts compilado consumido desde otro paquete.
export const CreateNotificacionSchema = z.object({
  idUsuario: z.string(),
  titulo: z.string(),
  mensaje: z.string(),
  tipoAlerta: z.string().optional(),
  idPuntoMedicion: z.string().optional(),
  idCliente: z.string().optional(),
  origen: z.string().optional(),
  reglas: z.array(ReglaAvisoSchema).optional(),
  idTarea: z.string().optional(),
});
export type ICreateNotificacion = z.infer<typeof CreateNotificacionSchema>;
