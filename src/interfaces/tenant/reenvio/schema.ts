import { z } from "zod";

export const ReenvioSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  // Info
  url: z.string().optional(),
  body: z.string().optional(),
  headers: z.string().optional(),
  params: z.string().optional(),
});
export type IReenvio = z.infer<typeof ReenvioSchema>;
