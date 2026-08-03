import { z } from "zod";

export const DeviceProfileV4Schema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string().optional(),
  macVersion: z.string().optional(),
  regParamsRevision: z.string().optional(),
  supportsOtaa: z.boolean().optional(),
  supportsClassB: z.boolean().optional(),
  supportsClassC: z.boolean().optional(),
  tenantId: z.string().optional(),
});
export type IDeviceProfileV4 = z.infer<typeof DeviceProfileV4Schema>;

export const ListDeviceProfilesV4ResponseSchema = z.object({
  totalCount: z.number().optional(),
  result: z.array(DeviceProfileV4Schema).optional(),
});
export type IListDeviceProfilesV4Response = z.infer<
  typeof ListDeviceProfilesV4ResponseSchema
>;
