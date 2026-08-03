import { z } from "zod";

// Definido explícito (no derivado de .omit().required()): ver el comentario
// en gas/auditoria/create.ts — .required() no sobrevive portablemente al
// .d.ts compilado consumido desde otro paquete.
export const CreateNotificacionSchema = z.object({
  idUsuario: z.string(),
  titulo: z.string(),
  mensaje: z.string(),
});
export type ICreateNotificacion = z.infer<typeof CreateNotificacionSchema>;
