// Payloads de webhook HTTP integration de ChirpStack v4.
// El operador del NS configura una HTTP integration apuntando a
// {url-gas}/chirpstack-v4/events?event=<tipo>.

import { z } from "zod";

export const DeviceInfoWebhookV4Schema = z.object({
  tenantId: z.string().optional(),
  tenantName: z.string().optional(),
  applicationId: z.string().optional(),
  applicationName: z.string().optional(),
  deviceProfileId: z.string().optional(),
  deviceProfileName: z.string().optional(),
  deviceName: z.string().optional(),
  deviceClassEnabled: z.string().optional(),
  // devEui en hex (no base64 como v3).
  devEui: z.string(),
  tags: z.record(z.string(), z.string()).optional(),
});
export type IDeviceInfoWebhookV4 = z.infer<typeof DeviceInfoWebhookV4Schema>;

export const RxInfoV4Schema = z.object({
  gatewayId: z.string().optional(),
  uplinkId: z.number().optional(),
  time: z.string().optional(),
  rssi: z.number().optional(),
  snr: z.number().optional(),
  channel: z.number().optional(),
  rfChain: z.number().optional(),
  context: z.string().optional(),
  location: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      altitude: z.number().optional(),
    })
    .optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});
export type IRxInfoV4 = z.infer<typeof RxInfoV4Schema>;

export const TxInfoV4Schema = z.object({
  frequency: z.number().optional(),
  modulation: z
    .object({
      lora: z
        .object({
          bandwidth: z.number().optional(),
          spreadingFactor: z.number().optional(),
          codeRate: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});
export type ITxInfoV4 = z.infer<typeof TxInfoV4Schema>;

export const UplinkV4Schema = z.object({
  deduplicationId: z.string().optional(),
  time: z.string().optional(),
  deviceInfo: DeviceInfoWebhookV4Schema,
  devAddr: z.string().optional(),
  adr: z.boolean().optional(),
  dr: z.number().optional(),
  fCnt: z.number().optional(),
  fPort: z.number().optional(),
  confirmed: z.boolean().optional(),
  // base64.
  data: z.string().optional(),
  object: z.record(z.string(), z.unknown()).optional(),
  rxInfo: z.array(RxInfoV4Schema).optional(),
  txInfo: TxInfoV4Schema.optional(),
});
export type IUplinkV4 = z.infer<typeof UplinkV4Schema>;

export const JoinV4Schema = z.object({
  deduplicationId: z.string().optional(),
  time: z.string().optional(),
  deviceInfo: DeviceInfoWebhookV4Schema,
  devAddr: z.string().optional(),
});
export type IJoinV4 = z.infer<typeof JoinV4Schema>;

export const AckV4Schema = z.object({
  deduplicationId: z.string().optional(),
  time: z.string().optional(),
  deviceInfo: DeviceInfoWebhookV4Schema,
  queueItemId: z.string().optional(),
  acknowledged: z.boolean(),
  fCntDown: z.number().optional(),
});
export type IAckV4 = z.infer<typeof AckV4Schema>;
