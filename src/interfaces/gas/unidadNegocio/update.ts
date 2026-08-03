import { z } from "zod";
import { UnidadNegocioSchema } from "./schema";

export const UpdateUnidadNegocioSchema = UnidadNegocioSchema.omit({
  _id: true,
  idCliente: true,
});
export type IUpdateUnidadNegocio = z.infer<typeof UpdateUnidadNegocioSchema>;
