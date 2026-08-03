import { z } from "zod";
import { CentroOperativoSchema } from "./schema";

export const UpdateCentroOperativoSchema = CentroOperativoSchema.omit({
  _id: true,
  idCliente: true,
  unidadNegocio: true,
});
export type IUpdateCentroOperativo = z.infer<
  typeof UpdateCentroOperativoSchema
>;
