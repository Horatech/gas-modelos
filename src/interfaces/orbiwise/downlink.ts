export interface IDownlinkOrbiwise {
  deveui: string; // "hex"; // DevEUI of the receiving device
  id: number; // 252; // unique ID of the dl payload
  data: string; // "ABC="; // Optional*,the payload data sent
  fcnt: number; // 10; // the used downlink FCNT
  port: number; // 1; // the used port
  tag: string; // "optional-tag-string";
  transmissionStatus: number; // 0;
  session_id: string; // "UUID"; // session ID when packet was created
}
