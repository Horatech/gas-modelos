import { z } from "zod";
import { ClienteSchema } from "../tenant/cliente.model";

export const ApikeySchema = z.object({
  _id: z.string().optional(),
  //
  fechaCreacion: z.string().optional(),
  identificacion: z.string().optional(),
  key: z.string().optional(),
  idCliente: z.string().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
});
export type IApikey = z.infer<typeof ApikeySchema>;

const omitir = { _id: true, fechaCreacion: true, cliente: true } as const;

export const CreateApikeySchema = ApikeySchema.omit(omitir);
export type ICreateApikey = z.infer<typeof CreateApikeySchema>;

export const UpdateApikeySchema = ApikeySchema.omit(omitir);
export type IUpdateApikey = z.infer<typeof UpdateApikeySchema>;
