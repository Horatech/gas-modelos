import { z } from "zod";

export const ApplicationV4Schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tenantId: z.string().optional(),
});
export type IApplicationV4 = z.infer<typeof ApplicationV4Schema>;

export const ListApplicationsV4ResponseSchema = z.object({
  totalCount: z.number().optional(),
  result: z.array(ApplicationV4Schema).optional(),
});
export type IListApplicationsV4Response = z.infer<
  typeof ListApplicationsV4ResponseSchema
>;
