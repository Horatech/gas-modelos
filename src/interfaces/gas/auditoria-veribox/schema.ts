import { z } from "zod";

export const AuditoriaVeriboxSchema = z.object({
  _id: z.string().optional(),
  deveui: z.string().optional(),
  fechaCreacion: z.string().optional(),
  fecha: z.string().optional(),
  comando: z.string().optional(),
  valorOriginal: z.string().nullable().optional(),
  valorNuevo: z.string().nullable().optional(),
  // Tenancy
  idCliente: z.string().optional(),
});
export type IAuditoriaVeribox = z.infer<typeof AuditoriaVeriboxSchema>;

/////////////////////////////////////////
// CREATE
export const CreateAuditoriaVeriboxSchema = AuditoriaVeriboxSchema.omit({
  _id: true,
});
export type ICreateAuditoriaVeribox = z.infer<
  typeof CreateAuditoriaVeriboxSchema
>;
// UPDATE
export const UpdateAuditoriaVeriboxSchema = AuditoriaVeriboxSchema.omit({
  _id: true,
  fechaCreacion: true,
});
export type IUpdateAuditoriaVeribox = z.infer<
  typeof UpdateAuditoriaVeriboxSchema
>;
/////////////////////////////////////////
