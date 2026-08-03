import { z } from "zod";
import type { ICliente } from "../../tenant/cliente.model";
import type { IUsuario } from "../../tenant/usuario/schema";

export const AuditoriaSchema = z.object({
  _id: z.string().optional(),
  entidad: z.string().optional(),
  metodo: z.string().optional(),
  dato: z.record(z.string(), z.any()).optional(),
  idUsuario: z.string().optional(),
  idCliente: z.string().optional(),
  fechaCreacion: z.string().optional(),
  // Populate
  usuario: z.custom<IUsuario>().optional(),
  cliente: z.custom<ICliente>().optional(),
});
export type IAuditoria = z.infer<typeof AuditoriaSchema>;
