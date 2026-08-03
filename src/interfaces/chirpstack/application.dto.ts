import { z } from "zod";

export const CreateApplicationChirpstackSchema = z.object({
  application: z.object({
    description: z.string(),
    id: z.string().optional(),
    name: z.string(),
    organizationID: z.string(),
    payloadCodec: z.string().optional(),
    payloadDecoderScript: z.string().optional(),
    payloadEncoderScript: z.string().optional(),
    serviceProfileID: z.string(),
  }),
});
export type ICreateApplicationChirpstack = z.infer<
  typeof CreateApplicationChirpstackSchema
>;
