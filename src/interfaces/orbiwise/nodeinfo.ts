export interface INodeInfoOrbiwise {
  deveui: string; // "hex"; // DevEUI of source device
  device_status: number; // 3;
  last_reception: string; // "timestamp"; // time when device was last seen in GMT time
  dl_fcnt: number; // 45; // last used downlink FCNT
  device_class: number; // 0; // 0: class A, 1: class B, 2: class C
  registration_status: number; // 1;
  expiry_time_uplink: number; // 168; // ul payload expiry time in hours
  expiry_time_downlink: number; // 168; // dl payload expiry time in hours
}
