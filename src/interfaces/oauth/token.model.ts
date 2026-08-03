import { z } from "zod";
import { UsuarioSchema } from "../tenant/usuario/schema";
import { ClientSchema } from "./client.model";

export const TokenSchema = z.object({
  accessToken: z.string().optional(),
  accessTokenExpiresAt: z.string().optional(),
  refreshToken: z.string().optional(),
  refreshTokenExpiresAt: z.string().optional(),
  scope: z.union([z.string(), z.array(z.string())]).optional(),
  client: ClientSchema.optional(),
  user: UsuarioSchema.optional(),
});
export type IToken = z.infer<typeof TokenSchema>;
