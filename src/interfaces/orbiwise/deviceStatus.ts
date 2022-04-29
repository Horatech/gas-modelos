export interface IDeviceStatusOrbiwise {
  deveui: string; // "hex"; // DevEUI of source device
  /**
   * value from LoraWAN specification
   * 0: connected to power source,
   * 1..254: battery level 1 being minimum and
   * 254 being maximum,
   * 255: not possible for the device to measure
   * battery level
   */
  battery_status: number;
  margin_status: number; // 0; // demodulation SNR [dB]for the DevStatusReq  // command message received
  timestamp_status: string; // "2015-02-06T10:43:23.331Z"; // UTC time last report
  req_status: number; // 0: never updated, 1: update requested, 2: request pending, 3: result ready
}
