export interface IMetadatos {
  gatewayID: string;
  timestamp: string;
  rssi: number;
  loRaSNR: number;
  location: {
    altitude: number;
    latitude: number;
    longitude: number;
  };
}
