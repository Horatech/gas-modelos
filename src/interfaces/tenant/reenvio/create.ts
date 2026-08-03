import { z } from "zod";
import { ReenvioSchema } from "./schema";

export const CreateReenvioSchema = ReenvioSchema.omit({ _id: true });
export type ICreateReenvio = z.infer<typeof CreateReenvioSchema>;
