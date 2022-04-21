export interface ICreateDeviceChirpstack {
  device: {
    applicationID: string;
    description: string;
    devEUI: string;
    deviceProfileID: string;
    isDisabled?: boolean;
    name: string;
    referenceAltitude?: number;
    skipFCntCheck?: boolean;
    tags?: Record<string, string>;
    variables?: Record<string, string>;
  };
}
