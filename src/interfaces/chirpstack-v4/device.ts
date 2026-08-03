import { z } from "zod";

export const DeviceInfoV4Schema = z.object({
  applicationId: z.string().optional(),
  deviceProfileId: z.string().optional(),
  devEui: z.string().optional(),
  joinEui: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  isDisabled: z.boolean().optional(),
  skipFcntCheck: z.boolean().optional(),
  tags: z.record(z.string(), z.string()).optional(),
  variables: z.record(z.string(), z.string()).optional(),
});
export type IDeviceInfoV4 = z.infer<typeof DeviceInfoV4Schema>;

export const CreateUpdateDeviceV4Schema = z.object({
  device: DeviceInfoV4Schema.optional(),
});
export type ICreateUpdateDeviceV4 = z.infer<typeof CreateUpdateDeviceV4Schema>;

export const DeviceStatusV4Schema = z.object({
  batteryLevel: z.number().optional(),
  externalPowerSource: z.boolean().optional(),
  margin: z.number().optional(),
});
export type IDeviceStatusV4 = z.infer<typeof DeviceStatusV4Schema>;

export const DeviceChirpstackV4Schema = z.object({
  classEnabled: z.string().optional(),
  createdAt: z.string().optional(),
  lastSeenAt: z.string().optional(),
  updatedAt: z.string().optional(),
  device: DeviceInfoV4Schema.optional(),
  deviceStatus: DeviceStatusV4Schema.optional(),
});
export type IDeviceChirpstackV4 = z.infer<typeof DeviceChirpstackV4Schema>;
