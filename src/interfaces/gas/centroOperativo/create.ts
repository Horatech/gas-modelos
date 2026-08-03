import { z } from "zod";

// Definido explícito (no derivado de .omit().required()): ver el comentario
// en gas/auditoria/create.ts — .required() no sobrevive portablemente al
// .d.ts compilado consumido desde otro paquete.
export const CreateCentroOperativoSchema = z.object({
  nombre: z.string(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string(),
});
export type ICreateCentroOperativo = z.infer<
  typeof CreateCentroOperativoSchema
>;
