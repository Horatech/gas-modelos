import { z } from "zod";
import { GatewayInfoOrbiwiseSchema } from "./gatewayInfo";

export const UplinkOrbiwiseSchema = z.object({
  early: z.boolean(), // false; // true: payloads_ul(early), false: payloads_ul(complete)
  deveui: z.string(), // "hex"; // DevEUI of source device
  dataFrame: z.string(), // "AB=="; // raw (encrypted) payload in base64 format
  port: z.number(), // 1; // MAC port the message was receive on
  timestamp: z.string(), // "2015-02-11T10:33:00.578Z"; // time of reception in GMT
  fcnt: z.number(), // 138; // uplink FCNT (needed for decryption)
  rssi: z.number(), // -111; // RSSI from gateway
  snr: z.number(), // -6; // SNR from gateway
  sf_used: z.number(), // 8; // used spreading factor
  id: z.number(), // 278998; // unique identifier (64-bit) of payload.
  live: z.literal(true), // indicate if the message is live, or resent from the temporary storage
  session_id: z.string(), // "session-uuid"; // session ID under which the packet was received
  decrypted: z.boolean(), // set true if the DASS decrypted the payload, false if the message is still encrypted.
  gtw_info: z.array(GatewayInfoOrbiwiseSchema), // see note below.
  latitude: z.number(), // 34;
  longitude: z.number(), // 30;
  altitude: z.number(), // 0;
});
export type IUplinkOrbiwise = z.infer<typeof UplinkOrbiwiseSchema>;
