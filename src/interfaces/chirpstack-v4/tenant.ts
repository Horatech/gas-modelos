import { z } from "zod";

export const TenantV4Schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  canHaveGateways: z.boolean().optional(),
  maxGatewayCount: z.number().optional(),
  maxDeviceCount: z.number().optional(),
  privateGatewaysUp: z.boolean().optional(),
  privateGatewaysDown: z.boolean().optional(),
});
export type ITenantV4 = z.infer<typeof TenantV4Schema>;

export const ListTenantsV4ResponseSchema = z.object({
  totalCount: z.number().optional(),
  result: z.array(TenantV4Schema).optional(),
});
export type IListTenantsV4Response = z.infer<typeof ListTenantsV4ResponseSchema>;
