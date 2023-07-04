export interface ICoordenadas {
  lat: number;
  lng: number;
}

export type GeoJSONType =
  | 'Point'
  | 'LineString'
  | 'Polygon'
  | 'MultiPoint'
  | 'MultiLineString'
  | 'MultiPolygon'
  | 'GeometryCollection';

export type GeoJSON = {
  type: GeoJSONType;
  coordinates:
    | [number, number]
    | [number, number][]
    | [number, number][][]
    | [number, number][][][];
};
