import { z } from "zod";

export const TipoLoraServerSchema = z.enum([
  "ChirpStack",
  "ChirpStackV4",
  "Orbiwise",
  "Actility",
  "WMC",
]);
export type TipoLoraServer = z.infer<typeof TipoLoraServerSchema>;

export const LoraServerSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().optional(),
  url: z.string().optional(),
  tipo: TipoLoraServerSchema.optional(),
  // ChirpStack v3
  token: z.string().optional(),
  organizationID: z.string().optional(),
  serviceProfileID: z.string().optional(),
  integrationUrl: z.string().optional(),
  // ChirpStack v4 (NS externo: triple tenant/app/DP preexistente)
  apiToken: z.string().optional(),
  tenantId: z.string().optional(),
  applicationId: z.string().optional(),
  deviceProfileId: z.string().optional(),
  // Apikey que el operador cargó en la integración HTTP del NS externo.
  // Sólo informativo: la apikey que valida la ingesta vive en env del servicio.
  integrationApikey: z.string().optional(),
  // Orbiwise
  user: z.string().optional(),
  pass: z.string().optional(),
  serviceProfileUUID: z.string().optional(),
});
export type ILoraServer = z.infer<typeof LoraServerSchema>;
