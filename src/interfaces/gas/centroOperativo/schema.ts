import { z } from "zod";
import { UnidadNegocioSchema } from "../unidadNegocio/schema";

export const CentroOperativoSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  // Populate
  unidadNegocio: UnidadNegocioSchema.optional(),
});
export type ICentroOperativo = z.infer<typeof CentroOperativoSchema>;
