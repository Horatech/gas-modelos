export interface IDeviceKeysChirpstack {
  deviceKeys: {
    appKey: string;
    devEUI: string;
    genAppKey?: string;
    nwkKey: string;
  };
}
