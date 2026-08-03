import { z } from "zod";
import { CentroOperativoSchema } from "./schema";

export const CreateCentroOperativoSchema = CentroOperativoSchema.omit({
  _id: true,
  unidadNegocio: true,
}).required({
  nombre: true,
  idUnidadNegocio: true,
});
export type ICreateCentroOperativo = z.infer<
  typeof CreateCentroOperativoSchema
>;
