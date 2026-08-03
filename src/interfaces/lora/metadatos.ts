import { z } from "zod";

export const MetadatosSchema = z.object({
  gatewayID: z.string().optional(),
  timestamp: z.string().optional(),
  rssi: z.number().optional(),
  loRaSNR: z.number().optional(),
  location: z
    .object({
      altitude: z.number().optional(),
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});
export type IMetadatos = z.infer<typeof MetadatosSchema>;
