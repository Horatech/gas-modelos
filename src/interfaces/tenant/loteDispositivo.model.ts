import { z } from "zod";

export const LoteDispositivoSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().optional(),
  llave: z.string().optional(),
});
export type ILoteDispositivo = z.infer<typeof LoteDispositivoSchema>;
