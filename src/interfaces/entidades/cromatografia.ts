import { z } from "zod";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { UsuarioSchema } from "../tenant/usuario/schema";
import { CuencaSchema } from "./cuenca";

export const ElementosSchema = z.object({
  oxigeno: z.number().optional(),
  densidad: z.number().optional(),
  dioxidoCarbono: z.number().optional(),
  nitrogeno: z.number().optional(),
  metano: z.number().optional(),
  etano: z.number().optional(),
  propano: z.number().optional(),
  isoButano: z.number().optional(),
  nButano: z.number().optional(),
  isoPentano: z.number().optional(),
  nPentano: z.number().optional(),
  nHexano: z.number().optional(),
  nHeptano: z.number().optional(),
  nOctano: z.number().optional(),
});
export type IElementos = z.infer<typeof ElementosSchema>;

export const CromatografiaSchema = z.object({
  _id: z.string().optional(),
  idUsuario: z.string().optional(),
  idCuenca: z.string().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  fechaAplicacion: z.string().optional(),
  fechaVencimiento: z.string().optional(),
  elementos: ElementosSchema.optional(),
  //
  fechaCreacion: z.string().optional(),
  // Virtual
  cuenca: CuencaSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  usuario: UsuarioSchema.optional(),
});
export type ICromatografia = z.infer<typeof CromatografiaSchema>;

const omitir = {
  _id: true,
  fechaCreacion: true,
  cuenca: true,
  unidadNegocio: true,
  usuario: true,
} as const;

export const CreateCromatografiaSchema = CromatografiaSchema.omit(omitir);
export type ICreateCromatografia = z.infer<typeof CreateCromatografiaSchema>;

export const UpdateCromatografiaSchema = CromatografiaSchema.omit(omitir);
export type IUpdateCromatografia = z.infer<typeof UpdateCromatografiaSchema>;
