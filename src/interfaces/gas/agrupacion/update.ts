import { z } from "zod";
import { AgrupacionSchema } from "./schema";

export const UpdateAgrupacionSchema = AgrupacionSchema.omit({
  _id: true,
});
export type IUpdateAgrupacion = z.infer<typeof UpdateAgrupacionSchema>;
