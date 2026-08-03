import { z } from "zod";

export const CreateDeviceOrbiwiseSchema = z.object({
  deveui: z.string(),
  lora_device_class: z.number().optional(),
  appeui: z.string().optional(),
  appkey: z.string().optional(),
  nwkkey: z.string().optional(),
  nwkskey: z.string().optional(),
  snwksintkey: z.string().optional(),
  fnwksintkey: z.string().optional(),
  nwksenckey: z.string().optional(),
  appskey: z.string().optional(),
  applications: z.string().optional(),
  groups: z.string().optional(),
  userid: z.string().optional(),
  comment: z.string().optional(),
  altitude: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  options: z.number().optional(),
  activated: z.literal(true).optional(),
  device_profile_uuid: z.string(),
  service_profile_uuid: z.string(),
});
export type ICreateDeviceOrbiwise = z.infer<typeof CreateDeviceOrbiwiseSchema>;
