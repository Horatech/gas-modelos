import { z } from "zod";

export const OrganizationChirpstackSchema = z.object({
  canHaveGateways: z.boolean(),
  createdAt: z.string(),
  displayName: z.string(),
  id: z.string(),
  name: z.string(),
  updatedAt: z.string(),
});
export type IOrganizationChirpstack = z.infer<typeof OrganizationChirpstackSchema>;
