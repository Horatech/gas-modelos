// Payloads de webhook HTTP integration de ChirpStack v4.
// El operador del NS configura una HTTP integration apuntando a
// {url-gas}/chirpstack-v4/events?event=<tipo>.

export interface IDeviceInfoWebhookV4 {
  tenantId?: string;
  tenantName?: string;
  applicationId?: string;
  applicationName?: string;
  deviceProfileId?: string;
  deviceProfileName?: string;
  deviceName?: string;
  deviceClassEnabled?: string;
  // devEui en hex (no base64 como v3).
  devEui: string;
  tags?: Record<string, string>;
}

export interface IRxInfoV4 {
  gatewayId?: string;
  uplinkId?: number;
  time?: string;
  rssi?: number;
  snr?: number;
  channel?: number;
  rfChain?: number;
  context?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
  };
  metadata?: Record<string, string>;
}

export interface ITxInfoV4 {
  frequency?: number;
  modulation?: {
    lora?: {
      bandwidth?: number;
      spreadingFactor?: number;
      codeRate?: string;
    };
  };
}

export interface IUplinkV4 {
  deduplicationId?: string;
  time?: string;
  deviceInfo: IDeviceInfoWebhookV4;
  devAddr?: string;
  adr?: boolean;
  dr?: number;
  fCnt?: number;
  fPort?: number;
  confirmed?: boolean;
  // base64.
  data?: string;
  object?: Record<string, unknown>;
  rxInfo?: IRxInfoV4[];
  txInfo?: ITxInfoV4;
}

export interface IJoinV4 {
  deduplicationId?: string;
  time?: string;
  deviceInfo: IDeviceInfoWebhookV4;
  devAddr?: string;
}

export interface IAckV4 {
  deduplicationId?: string;
  time?: string;
  deviceInfo: IDeviceInfoWebhookV4;
  queueItemId?: string;
  acknowledged: boolean;
  fCntDown?: number;
}
