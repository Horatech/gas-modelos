export interface IJoinInfoOrbiwise {
  deveui: string; // "hex"; // DevEUI (8 bytes) of source device
  appeui: string; // "hex"; // AppEUI (8 bytes) of source device
  join_status: string; // "JOIN_ACCEPTED";
  session_id: string; // "uuid";
}
