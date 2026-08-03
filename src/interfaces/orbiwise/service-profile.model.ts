import { z } from "zod";

export const ServiceProfileOrbiwiseSchema = z.object({
  profile_uuid: z.string(),
  profile_name: z.string(),
  description: z.string(),
  shared_with_all_users: z.boolean(),
  link_to_profile_uuid: z.string(),
});
export type IServiceProfileOrbiwise = z.infer<
  typeof ServiceProfileOrbiwiseSchema
>;
