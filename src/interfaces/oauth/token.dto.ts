import { z } from "zod";
import { UsuarioSchema } from "../tenant/usuario/schema";
import { CreateClientSchema } from "./client.dto";

export const CreateTokenSchema = z.object({
  accessToken: z.string(),
  accessTokenExpiresAt: z.string().optional(),
  refreshToken: z.string().optional(),
  refreshTokenExpiresAt: z.string().optional(),
  scope: z.union([z.string(), z.array(z.string())]).optional(),
  client: CreateClientSchema,
  user: UsuarioSchema,
});
export type ICreateToken = z.infer<typeof CreateTokenSchema>;
