import { z } from "zod";

export const CreateIntegrationHTTPChirpstackSchema = z.object({
  integration: z.object({
    ackNotificationURL: z.string().optional(),
    applicationID: z.string(),
    errorNotificationURL: z.string().optional(),
    eventEndpointURL: z.string(),
    headers: z
      .array(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      )
      .optional(),
    integrationNotificationURL: z.string().optional(),
    joinNotificationURL: z.string().optional(),
    locationNotificationURL: z.string().optional(),
    marshaler: z.enum(["JSON", "PROTOBUF", "JSON_V3"]).optional(),
    statusNotificationURL: z.string().optional(),
    txAckNotificationURL: z.string().optional(),
    uplinkDataURL: z.string().optional(),
  }),
});
export type ICreateIntegrationHTTPChirpstack = z.infer<
  typeof CreateIntegrationHTTPChirpstackSchema
>;
