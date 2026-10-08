import { z } from "zod";
import type { IUsuario } from "../../tenant/usuario/schema";

// Los tres links que manda gas-api-cliente. El token se guarda hasheado (SHA-256 hex).
export const TipoTokenSchema = z.enum(["reset", "definir-clave", "verificar-email"]);
export type ITipoToken = z.infer<typeof TipoTokenSchema>;

export const PasswordResetSchema = z.object({
  _id: z.string().optional(),
  idUsuario: z.string().optional(),
  token: z.string().optional(),
  tipo: TipoTokenSchema.optional(),
  // sólo en verificar-email: la dirección nueva, normalizada
  email: z.string().optional(),
  vencimiento: z.string().optional(),
  utilizado: z.boolean().optional(),

  // virtuals
  usuario: z.custom<IUsuario>().optional(),
});
export type IPasswordReset = z.infer<typeof PasswordResetSchema>;

export const CreatePasswordResetSchema = PasswordResetSchema.omit({
  _id: true,
  usuario: true,
});
export type ICreatePasswordReset = z.infer<typeof CreatePasswordResetSchema>;

export const UpdatePasswordResetSchema = PasswordResetSchema.omit({
  _id: true,
  usuario: true,
});
export type IUpdatePasswordReset = z.infer<typeof UpdatePasswordResetSchema>;

export const ConsumirTokenSchema = z.object({
  token: z.string(),
  tipos: z.array(TipoTokenSchema).min(1),
});
export type IConsumirToken = z.infer<typeof ConsumirTokenSchema>;
