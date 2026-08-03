import { z } from "zod";
import { UnidadNegocioSchema } from "./schema";

export const CreateUnidadNegocioSchema = UnidadNegocioSchema.omit({
  _id: true,
}).required({
  nombre: true,
});
export type ICreateUnidadNegocio = z.infer<typeof CreateUnidadNegocioSchema>;
