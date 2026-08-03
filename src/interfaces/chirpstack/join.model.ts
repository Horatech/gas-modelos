import { z } from "zod";

export const JoinChirpstackSchema = z.object({
  applicationID: z.string(),
  applicationName: z.string(),
  deviceName: z.string(),
  devEUI: z.string(),
  devAddr: z.string(),
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
  dr: z.literal(1),
  tags: z.record(z.string(), z.string()),
});
export type IJoinChirpstack = z.infer<typeof JoinChirpstackSchema>;
