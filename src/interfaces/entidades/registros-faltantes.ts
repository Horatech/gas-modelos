import { z } from "zod";

export const RegistroFaltanteSchema = z.object({
  _id: z.string().optional(),
  timestamp: z.string().optional(),
  deveui: z.string().optional(),
});
export type IRegistroFaltante = z.infer<typeof RegistroFaltanteSchema>;

////// CREATE
export const CreateRegistroFaltanteSchema = RegistroFaltanteSchema.omit({
  _id: true,
});
export type ICreateRegistroFaltante = z.infer<
  typeof CreateRegistroFaltanteSchema
>;

////// UPDATE
export const UpdateRegistroFaltanteSchema = RegistroFaltanteSchema.omit({
  _id: true,
});
export type IUpdateRegistroFaltante = z.infer<
  typeof UpdateRegistroFaltanteSchema
>;
