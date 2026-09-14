import { z } from "zod";

// Definido explícito (no derivado de .omit().required()): ver el comentario
// en gas/auditoria/create.ts — .required() no sobrevive portablemente al
// .d.ts compilado consumido desde otro paquete.
export const CreateNotificacionSchema = z.object({
  idUsuario: z.string(),
  titulo: z.string(),
  mensaje: z.string(),
  tipoAlerta: z.string().optional(),
  idPuntoMedicion: z.string().optional(),
  idAlerta: z.string().optional(),
});
export type ICreateNotificacion = z.infer<typeof CreateNotificacionSchema>;
