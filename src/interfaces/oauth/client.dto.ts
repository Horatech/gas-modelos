import { z } from "zod";

export const CreateClientSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  grants: z.array(z.string()),
  redirectUris: z.array(z.string()),
  accessTokenLifetime: z.number(),
  refreshTokenLifetime: z.number(),
});
export type ICreateClient = z.infer<typeof CreateClientSchema>;
