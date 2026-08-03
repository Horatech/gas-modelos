import { z } from "zod";
import { TipoMensajeNucSchema } from "./mensajes-nuc/mensajes-nuc";

export const LogNucSchema = z.object({
  _id: z.string().optional(),
  deveui: z.string().optional(),
  tipo: TipoMensajeNucSchema.optional(),
  body: z.record(z.string(), z.any()).optional(),
  fecha: z.string().optional(),
  tiempoRespuesta: z.number().optional(),
  codigoRespuesta: z.number().optional(),
  respuesta: z.record(z.string(), z.any()).optional(),
});
export type ILogNuc = z.infer<typeof LogNucSchema>;

////// CREATE
export const CreateLogNucSchema = LogNucSchema.omit({ _id: true });
export type ICreateLogNuc = z.infer<typeof CreateLogNucSchema>;

////// UPDATE
export const UpdateLogNucSchema = LogNucSchema.omit({ _id: true });
export type IUpdateLogNuc = z.infer<typeof UpdateLogNucSchema>;
