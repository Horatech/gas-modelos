import { z } from "zod";

export const DeviceProfileChirpstackSchema = z.object({
  createdAt: z.string(),
  id: z.string(),
  name: z.string(),
  networkServerID: z.string(),
  networkServerName: z.string(),
  organizationID: z.string(),
  updatedAt: z.string(),
});
export type IDeviceProfileChirpstack = z.infer<typeof DeviceProfileChirpstackSchema>;
