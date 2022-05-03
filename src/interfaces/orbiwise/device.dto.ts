export interface ICreateDeviceOrbiwise {
  deveui: string;
  lora_device_class?: number;
  appeui?: string;
  appkey?: string;
  nwkkey?: string;
  nwkskey?: string;
  snwksintkey?: string;
  fnwksintkey?: string;
  nwksenckey?: string;
  appskey?: string;
  applications?: string;
  groups?: string;
  userid?: string;
  comment?: string;
  altitude?: number;
  latitude?: number;
  longitude?: number;
  options?: number;
  activated?: true;
  device_profile_uuid: string;
  service_profile_uuid: string;
}
