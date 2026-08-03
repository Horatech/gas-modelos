import { z } from "zod";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { ClienteSchema } from "../tenant/cliente.model";

export const KmzSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  nombre: z.string().optional(),
  urlKmz: z.string().optional(),
  // GeoJSON pre-convertido del KMZ, generado por la API al momento del
  // upload y subido a GCS igual que urlKmz. Opcional: KMZs anteriores a
  // esta feature no lo tienen y el frontend cae al parseo client-side.
  urlGeoJson: z.string().optional(),

  // Virtuals
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
});
export type IKmz = z.infer<typeof KmzSchema>;

export const CreateKmzSchema = KmzSchema.omit({
  _id: true,
  cliente: true,
  unidadNegocio: true,
  centroOperativo: true,
});
export type ICreateKmz = z.infer<typeof CreateKmzSchema>;

export const UpdateKmzSchema = KmzSchema.omit({
  _id: true,
  cliente: true,
  unidadNegocio: true,
  centroOperativo: true,
  idCliente: true,
});
export type IUpdateKmz = z.infer<typeof UpdateKmzSchema>;
