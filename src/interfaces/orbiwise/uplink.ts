import { IGatewayInfoOrbiwise } from "./gatewayInfo";

export interface IUplinkOrbiwise {
  early: boolean; // false; // true: payloads_ul(early), false: payloads_ul(complete)
  deveui: string; // "hex"; // DevEUI of source device
  dataFrame: string; // "AB=="; // raw (encrypted) payload in base64 format
  port: number; // 1; // MAC port the message was receive on
  timestamp: string; // "2015-02-11T10:33:00.578Z"; // time of reception in GMT
  fcnt: number; // 138; // uplink FCNT (needed for decryption)
  rssi: number; // -111; // RSSI from gateway
  snr: number; // -6; // SNR from gateway
  sf_used: number; // 8; // used spreading factor
  id: number; // 278998; // unique identifier (64-bit) of payload.
  live: true; // indicate if the message is live, or resent from the temporary storage
  session_id: string; // "session-uuid"; // session ID under which the packet was received
  decrypted: boolean; // set true if the DASS decrypted the payload, false if the message is still encrypted.
  gtw_info: IGatewayInfoOrbiwise[]; // see note below.
  latitude: number; // 34;
  longitude: number; // 30;
  altitude: number; // 0;
}
