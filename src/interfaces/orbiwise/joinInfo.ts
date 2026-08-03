import { z } from "zod";

export const JoinInfoOrbiwiseSchema = z.object({
  deveui: z.string(), // "hex"; // DevEUI (8 bytes) of source device
  appeui: z.string(), // "hex"; // AppEUI (8 bytes) of source device
  join_status: z.string(), // "JOIN_ACCEPTED";
  session_id: z.string(), // "uuid";
});
export type IJoinInfoOrbiwise = z.infer<typeof JoinInfoOrbiwiseSchema>;
