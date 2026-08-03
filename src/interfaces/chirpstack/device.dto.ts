import { z } from "zod";

export const CreateDeviceChirpstackSchema = z.object({
  device: z.object({
    applicationID: z.string(),
    description: z.string(),
    devEUI: z.string(),
    deviceProfileID: z.string(),
    isDisabled: z.boolean().optional(),
    name: z.string(),
    referenceAltitude: z.number().optional(),
    skipFCntCheck: z.boolean().optional(),
    tags: z.record(z.string(), z.string()).optional(),
    variables: z.record(z.string(), z.string()).optional(),
  }),
});
export type ICreateDeviceChirpstack = z.infer<typeof CreateDeviceChirpstackSchema>;
