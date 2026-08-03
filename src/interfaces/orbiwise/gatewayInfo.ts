import { z } from "zod";

export const GatewayInfoOrbiwiseSchema = z.object({
  gtw_id: z.string(), // "0000000012340000";
  rssi: z.number(), // -100;
  snr: z.number(), // 5;
});
export type IGatewayInfoOrbiwise = z.infer<typeof GatewayInfoOrbiwiseSchema>;
