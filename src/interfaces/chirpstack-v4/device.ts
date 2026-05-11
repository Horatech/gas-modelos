export interface IDeviceInfoV4 {
  applicationId?: string;
  deviceProfileId?: string;
  devEui?: string;
  joinEui?: string;
  name?: string;
  description?: string;
  isDisabled?: boolean;
  skipFcntCheck?: boolean;
  tags?: Record<string, string>;
  variables?: Record<string, string>;
}

export interface ICreateUpdateDeviceV4 {
  device?: IDeviceInfoV4;
}

export interface IDeviceStatusV4 {
  batteryLevel?: number;
  externalPowerSource?: boolean;
  margin?: number;
}

export interface IDeviceChirpstackV4 {
  classEnabled?: string;
  createdAt?: string;
  lastSeenAt?: string;
  updatedAt?: string;
  device?: IDeviceInfoV4;
  deviceStatus?: IDeviceStatusV4;
}
