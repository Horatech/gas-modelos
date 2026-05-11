export interface IDeviceKeysV4 {
  devEui?: string;
  // LoRaWAN 1.0: nwkKey == appKey. LoRaWAN 1.1: difieren.
  nwkKey?: string;
  appKey?: string;
  nwkSEncKey?: string;
}

export interface ICreateUpdateDeviceKeysV4 {
  deviceKeys?: IDeviceKeysV4;
}
