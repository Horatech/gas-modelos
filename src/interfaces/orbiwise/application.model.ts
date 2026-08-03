import { z } from "zod";

export const ApplicationOrbiwiseSchema = z.object({
  accountid: z.string(),
  app_uuid: z.string(),
  can_register: z.boolean(), // can administer device
  can_access_gtw_info: z.boolean(),
  can_own_gtw: z.boolean(), // can own gateways
  can_add_gtw: z.boolean(), // can add/remove gateways
  can_mng_gtw: z.boolean(), // can manage setting on gateway
  loraloc_enable: z.boolean(), // can enable lora location on devices
});
export type IApplicationOrbiwise = z.infer<typeof ApplicationOrbiwiseSchema>;
