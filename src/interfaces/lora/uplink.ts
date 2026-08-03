import { z } from "zod";
import { MetadatosSchema } from "./metadatos";

export const UplinkSchema = z.object({
  deveui: z.string(),
  deviceName: z.string().optional(),
  puerto: z.number(),
  payload: z.string(),
  metadatos: z.array(MetadatosSchema).optional(),
  adr: z.boolean().optional(),
  dr: z.number().optional(),
  fCnt: z.string(),
  tags: z.record(z.string(), z.string()).optional(),
});
export type IUplink = z.infer<typeof UplinkSchema>;
