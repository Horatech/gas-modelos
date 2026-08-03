import { z } from "zod";

export const ClientSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  grants: z.array(z.string()).optional(),
  redirectUris: z.array(z.string()).optional(),
  accessTokenLifetime: z.number().optional(),
  refreshTokenLifetime: z.number().optional(),
});
export type IClient = z.infer<typeof ClientSchema>;
