import { z } from "zod";

export const AgrupacionSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().optional(),
  idCliente: z.string().optional(),
});
export type IAgrupacion = z.infer<typeof AgrupacionSchema>;
