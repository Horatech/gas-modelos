export interface IAck {
  deveui: string;
  deviceName?: string;
  acknowledged: boolean;
  fCnt?: string;
  tags?: { [key: string]: string };
}
