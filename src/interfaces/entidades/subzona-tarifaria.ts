import { z } from "zod";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { DivisionSchema } from "../tenant/usuario/permiso";
import { LocalidadSchema } from "./localidad";

export const SubzonaTarifariaSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  // Una SZT agrupa varias Localidades; cada Localidad pertenece a lo sumo a
  // una SZT (unicidad enforced en backend).
  idsLocalidades: z.array(z.string()).optional(),
  posicion: z.number().optional(), // para ordenar en las pantallas
  division: DivisionSchema.optional(), // siempre 'Residencial'
  // Populate
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidades: z.array(LocalidadSchema).optional(),
});
export type ISubzonaTarifaria = z.infer<typeof SubzonaTarifariaSchema>;

// CREATE
export const CreateSubzonaTarifariaSchema = SubzonaTarifariaSchema.omit({
  _id: true,
  unidadNegocio: true,
  centroOperativo: true,
  localidades: true,
});
export type ICreateSubzonaTarifaria = z.infer<
  typeof CreateSubzonaTarifariaSchema
>;

// UPDATE
export const UpdateSubzonaTarifariaSchema = SubzonaTarifariaSchema.omit({
  _id: true,
  unidadNegocio: true,
  centroOperativo: true,
  localidades: true,
});
export type IUpdateSubzonaTarifaria = z.infer<
  typeof UpdateSubzonaTarifariaSchema
>;
