import { z } from "zod";
import { AuditoriaSchema } from "./schema";

export const CreateAuditoriaSchema = AuditoriaSchema.omit({
  _id: true,
  fechaCreacion: true,
  usuario: true,
  cliente: true,
}).required({
  entidad: true,
  metodo: true,
  dato: true,
  idUsuario: true,
  idCliente: true,
});
export type ICreateAuditoria = z.infer<typeof CreateAuditoriaSchema>;
