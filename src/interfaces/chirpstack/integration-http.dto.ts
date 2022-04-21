export interface ICreateIntegrationHTTPChirpstack {
  integration: {
    ackNotificationURL?: string;
    applicationID: string;
    errorNotificationURL?: string;
    eventEndpointURL: string;
    headers?: {
      key: string;
      value: string;
    }[];
    integrationNotificationURL?: string;
    joinNotificationURL?: string;
    locationNotificationURL?: string;
    marshaler?: "JSON" | "PROTOBUF" | "JSON_V3";
    statusNotificationURL?: string;
    txAckNotificationURL?: string;
    uplinkDataURL?: string;
  };
}
