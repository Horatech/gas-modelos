import { z } from "zod";

export const CreateApplicationOrbiwiseSchema = z.object({
  accountid: z.string(), // name or id of application
  password: z.string(), // password, optional, if not provided, it is auto generated.
  can_register: z.boolean(), // can administer device
  can_access_gtw_info: z.boolean(), // will receive info about gateways that received messages and can query position of general gateways
  can_own_gtw: z.boolean(), // can own gateways
  can_add_gtw: z.boolean(), // can add/remove gateways
  can_mng_gtw: z.boolean(), // can manage setting on gateway
  loraloc_enable: z.boolean(), // can enable lora location on devices
});
export type ICreateApplicationOrbiwise = z.infer<
  typeof CreateApplicationOrbiwiseSchema
>;
