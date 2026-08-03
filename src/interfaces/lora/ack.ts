import { z } from "zod";

export const AckSchema = z.object({
  deveui: z.string(),
  deviceName: z.string().optional(),
  acknowledged: z.boolean(),
  fCnt: z.string().optional(),
  tags: z.record(z.string(), z.string()).optional(),
});
export type IAck = z.infer<typeof AckSchema>;
