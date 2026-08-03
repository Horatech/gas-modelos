import { z } from "zod";

export const DownlinkOrbiwiseSchema = z.object({
  deveui: z.string(), // "hex"; // DevEUI of the receiving device
  id: z.number(), // 252; // unique ID of the dl payload
  data: z.string(), // "ABC="; // Optional*,the payload data sent
  fcnt: z.number(), // 10; // the used downlink FCNT
  port: z.number(), // 1; // the used port
  tag: z.string(), // "optional-tag-string";
  transmissionStatus: z.number(), // 0;
  session_id: z.string(), // "UUID"; // session ID when packet was created
});
export type IDownlinkOrbiwise = z.infer<typeof DownlinkOrbiwiseSchema>;
