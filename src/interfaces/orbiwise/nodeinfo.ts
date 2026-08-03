import { z } from "zod";

export const NodeInfoOrbiwiseSchema = z.object({
  deveui: z.string(), // "hex"; // DevEUI of source device
  device_status: z.number(), // 3;
  last_reception: z.string(), // "timestamp"; // time when device was last seen in GMT time
  dl_fcnt: z.number(), // 45; // last used downlink FCNT
  device_class: z.number(), // 0; // 0: class A, 1: class B, 2: class C
  registration_status: z.number(), // 1;
  expiry_time_uplink: z.number(), // 168; // ul payload expiry time in hours
  expiry_time_downlink: z.number(), // 168; // dl payload expiry time in hours
});
export type INodeInfoOrbiwise = z.infer<typeof NodeInfoOrbiwiseSchema>;
