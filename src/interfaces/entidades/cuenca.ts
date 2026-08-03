import { z } from "zod";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";

export const CuencaSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCliente: z.string().optional(),
  // Virtual
  unidadNegocio: UnidadNegocioSchema.optional(),
});
export type ICuenca = z.infer<typeof CuencaSchema>;

const omitir = { _id: true, unidadNegocio: true } as const;

export const CreateCuencaSchema = CuencaSchema.omit(omitir);
export type ICreateCuenca = z.infer<typeof CreateCuencaSchema>;

export const UpdateCuencaSchema = CuencaSchema.omit(omitir);
export type IUpdateCuenca = z.infer<typeof UpdateCuencaSchema>;
