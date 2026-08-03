import { z } from "zod";

// Definido explícito (no derivado de .omit().required()): ver el comentario
// en gas/auditoria/create.ts — .required() no sobrevive portablemente al
// .d.ts compilado consumido desde otro paquete.
export const CreateUnidadNegocioSchema = z.object({
  nombre: z.string(),
  idCliente: z.string().optional(),
});
export type ICreateUnidadNegocio = z.infer<typeof CreateUnidadNegocioSchema>;
