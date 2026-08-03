import { z } from "zod";

export const ServiceProfileChirpstackSchema = z.object({
  createdAt: z.string(),
  id: z.string(),
  name: z.string(),
  networkServerID: z.string(),
  networkServerName: z.string(),
  organizationID: z.string(),
  updatedAt: z.string(),
});
export type IServiceProfileChirpstack = z.infer<typeof ServiceProfileChirpstackSchema>;
