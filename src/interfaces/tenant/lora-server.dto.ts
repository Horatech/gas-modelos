import { z } from "zod";
import { LoraServerSchema, TipoLoraServerSchema } from "./lora-server.model";

// Definido explícito (no LoraServerSchema.omit().required()): ver el
// comentario en gas/auditoria/create.ts — .required() no sobrevive
// portablemente al .d.ts compilado consumido desde otro paquete.
export const CreateLoraServerSchema = z.object({
  nombre: z.string(),
  url: z.string(),
  tipo: TipoLoraServerSchema,
  token: z.string().optional(),
  organizationID: z.string().optional(),
  serviceProfileID: z.string().optional(),
  integrationUrl: z.string().optional(),
  apiToken: z.string().optional(),
  tenantId: z.string().optional(),
  applicationId: z.string().optional(),
  deviceProfileId: z.string().optional(),
  integrationApikey: z.string().optional(),
  user: z.string().optional(),
  pass: z.string().optional(),
  serviceProfileUUID: z.string().optional(),
});
export type ICreateLoraServer = z.infer<typeof CreateLoraServerSchema>;

export const UpdateLoraServerSchema = LoraServerSchema.omit({ _id: true });
export type IUpdateLoraServer = z.infer<typeof UpdateLoraServerSchema>;
