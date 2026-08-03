import { z } from "zod";

export const UnidadNegocioSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().optional(),
  idCliente: z.string().optional(),
});
export type IUnidadNegocio = z.infer<typeof UnidadNegocioSchema>;
