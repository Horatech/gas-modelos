import { z } from "zod";
import { ReenvioSchema } from "./schema";

export const UpdateReenvioSchema = ReenvioSchema.omit({ _id: true });
export type IUpdateReenvio = z.infer<typeof UpdateReenvioSchema>;
