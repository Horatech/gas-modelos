import { z } from "zod";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { CorrectoraSchema } from "./correctora";
import { CromatografiaSchema } from "./cromatografia";
import { CuencaSchema } from "./cuenca";

export const AplicacionCromatografiaSchema = z.object({
  _id: z.string().optional(),
  aplicada: z.boolean().optional(),
  idCromatografia: z.string().optional(),
  idCorrectora: z.string().optional(),
  numeroSerieCorrectora: z.string().nullable().optional(),
  fechaCreacion: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCuenca: z.string().optional(),
  // Virtual
  correctora: CorrectoraSchema.optional(),
  cromatografia: CromatografiaSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  cuenca: CuencaSchema.optional(),
});
export type IAplicacionCromatografia = z.infer<typeof AplicacionCromatografiaSchema>;

const omitir = {
  _id: true,
  fechaCreacion: true,
  correctora: true,
  cromatografia: true,
  unidadNegocio: true,
  cuenca: true,
} as const;

export const CreateAplicacionCromatografiaSchema =
  AplicacionCromatografiaSchema.omit(omitir);
export type ICreateAplicacionCromatografia = z.infer<
  typeof CreateAplicacionCromatografiaSchema
>;

export const UpdateAplicacionCromatografiaSchema =
  AplicacionCromatografiaSchema.omit(omitir);
export type IUpdateAplicacionCromatografia = z.infer<
  typeof UpdateAplicacionCromatografiaSchema
>;
