import { z } from "zod";

export const ApplicationChirpstackSchema = z.object({
  description: z.string(),
  id: z.string(),
  name: z.string(),
  organizationID: z.string(),
  serviceProfileID: z.string(),
  serviceProfileName: z.string(),
});
export type IApplicationChirpstack = z.infer<typeof ApplicationChirpstackSchema>;
