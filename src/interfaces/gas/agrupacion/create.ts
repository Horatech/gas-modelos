import { z } from "zod";
import { AgrupacionSchema } from "./schema";

export const CreateAgrupacionSchema = AgrupacionSchema.omit({
  _id: true,
});
export type ICreateAgrupacion = z.infer<typeof CreateAgrupacionSchema>;
