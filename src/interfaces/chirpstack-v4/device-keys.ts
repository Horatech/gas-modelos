import { z } from "zod";

export const DeviceKeysV4Schema = z.object({
  devEui: z.string().optional(),
  // LoRaWAN 1.0: nwkKey == appKey. LoRaWAN 1.1: difieren.
  nwkKey: z.string().optional(),
  appKey: z.string().optional(),
  nwkSEncKey: z.string().optional(),
});
export type IDeviceKeysV4 = z.infer<typeof DeviceKeysV4Schema>;

export const CreateUpdateDeviceKeysV4Schema = z.object({
  deviceKeys: DeviceKeysV4Schema.optional(),
});
export type ICreateUpdateDeviceKeysV4 = z.infer<
  typeof CreateUpdateDeviceKeysV4Schema
>;
