import { z } from "zod";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { DivisionSchema } from "../tenant/usuario/permiso";

export const GrupoSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  posicion: z.number().optional(), // para ordenar en las pantallas
  division: DivisionSchema.optional(),
  // Populate
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
});
export type IGrupo = z.infer<typeof GrupoSchema>;

const omitir = { _id: true, unidadNegocio: true, centroOperativo: true } as const;

export const CreateGrupoSchema = GrupoSchema.omit(omitir);
export type ICreateGrupo = z.infer<typeof CreateGrupoSchema>;

export const UpdateGrupoSchema = GrupoSchema.omit(omitir);
export type IUpdateGrupo = z.infer<typeof UpdateGrupoSchema>;
