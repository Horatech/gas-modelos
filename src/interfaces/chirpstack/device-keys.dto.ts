import { z } from "zod";

export const CreateDeviceKeysChirpstackSchema = z.object({
  deviceKeys: z.object({
    appKey: z.string(),
    devEUI: z.string(),
    genAppKey: z.string().optional(),
    nwkKey: z.string(),
  }),
});
export type ICreateDeviceKeysChirpstack = z.infer<
  typeof CreateDeviceKeysChirpstackSchema
>;
