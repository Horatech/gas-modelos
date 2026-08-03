import { z } from "zod";

export const DownlinkSchema = z.object({
  deveui: z.string(),
  puerto: z.number(),
  payload: z.string(),
});
export type IDownlink = z.infer<typeof DownlinkSchema>;
