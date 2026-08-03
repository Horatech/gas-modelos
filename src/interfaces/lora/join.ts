import { z } from "zod";
import { MetadatosSchema } from "./metadatos";

export const JoinSchema = z.object({
  deveui: z.string(),
  deviceName: z.string().optional(),
  metadatos: z.array(MetadatosSchema).optional(),
  adr: z.boolean().optional(),
  dr: z.number().optional(),
  tags: z.record(z.string(), z.string()).optional(),
});
export type IJoin = z.infer<typeof JoinSchema>;
