import { z } from "zod";

export const CoordenadasSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});
export type ICoordenadas = z.infer<typeof CoordenadasSchema>;

export const GeoJSONTypeSchema = z.enum([
  "Point",
  "LineString",
  "Polygon",
  "MultiPoint",
  "MultiLineString",
  "MultiPolygon",
  "GeometryCollection",
]);
export type GeoJSONType = z.infer<typeof GeoJSONTypeSchema>;

export const GeoJSONSchema = z.object({
  type: GeoJSONTypeSchema,
  coordinates: z.union([
    z.tuple([z.number(), z.number()]),
    z.array(z.tuple([z.number(), z.number()])),
    z.array(z.array(z.tuple([z.number(), z.number()]))),
    z.array(z.array(z.array(z.tuple([z.number(), z.number()])))),
  ]),
});
export type GeoJSON = z.infer<typeof GeoJSONSchema>;
