export interface ICreateDeviceKeysChirpstack {
  deviceKeys: {
    appKey: string;
    devEUI: string;
    genAppKey?: string;
    nwkKey: string;
  };
}
