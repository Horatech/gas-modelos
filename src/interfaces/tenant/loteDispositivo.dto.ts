import { z } from "zod";
import { LoteDispositivoSchema } from "./loteDispositivo.model";

// Definido explícito (no LoteDispositivoSchema.omit().required()): ver el
// comentario en gas/auditoria/create.ts — .required() no sobrevive
// portablemente al .d.ts compilado consumido desde otro paquete.
export const CreateLoteDispositivoSchema = z.object({
  nombre: z.string(),
  llave: z.string(),
});
export type ICreateLoteDispositivo = z.infer<typeof CreateLoteDispositivoSchema>;

export const UpdateLoteDispositivoSchema = LoteDispositivoSchema.omit({
  _id: true,
});
export type IUpdateLoteDispositivo = z.infer<typeof UpdateLoteDispositivoSchema>;
