import { z } from "zod";

export const UplinkChirpstackSchema = z.object({
  applicationID: z.string(),
  applicationName: z.string(),
  deviceName: z.string(),
  devEUI: z.string(),
  rxInfo: z.array(
    z.object({
      gatewayID: z.string(),
      time: z.string(),
      timeSinceGPSEpoch: z.null(),
      rssi: z.number(),
      loRaSNR: z.number(),
      channel: z.number(),
      rfChain: z.number(),
      board: z.number(),
      antenna: z.number(),
      location: z.object({
        latitude: z.number(),
        longitude: z.number(),
        altitude: z.number(),
      }),
      fineTimestampType: z.string(),
      context: z.string(),
      uplinkID: z.string(),
    })
  ),
  txInfo: z.object({
    frequency: z.number(),
    modulation: z.string(),
    loRaModulationInfo: z.object({
      bandwidth: z.number(),
      spreadingFactor: z.number(),
      codeRate: z.string(),
      polarizationInversion: z.boolean(),
    }),
  }),
  adr: z.boolean(),
  dr: z.number(),
  fCnt: z.number(),
  fPort: z.number(),
  data: z.string(),
  objectJSON: z.string(),
  tags: z.record(z.string(), z.string()),
});
export type IUplinkChirpstack = z.infer<typeof UplinkChirpstackSchema>;
