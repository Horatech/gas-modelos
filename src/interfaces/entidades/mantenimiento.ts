import { z } from "zod";
import { ClienteSchema } from "../tenant/cliente.model";
import { UsuarioSchema } from "../tenant/usuario/schema";
import { AgrupacionSchema } from "../gas/agrupacion/schema";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { CorrectoraSchema } from "./correctora";
import { DispositivoSchema } from "./dispositivo";
import { LocalidadSchema } from "./localidad";

export const MantenimientoSchema = z.object({
  _id: z.string().optional(),
  // Generado
  fechaCreacion: z.string().optional(),
  // Input
  fecha: z.string().optional(),
  descripcion: z.string().optional(),
  tipo: z.string().optional(),
  idAsignado: z.string().optional(),
  // Tenancy
  idCliente: z.string().optional(),
  idUsuario: z.string().optional(),
  idUnidadDeNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
  idAgrupacion: z.string().optional(),

  // Virtuals
  correctora: CorrectoraSchema.optional(),
  dispositivo: DispositivoSchema.optional(),
  cliente: ClienteSchema.optional(),
  usuario: UsuarioSchema.optional(),
  unidadDeNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
  agrupacion: AgrupacionSchema.optional(),
});
export type IMantenimiento = z.infer<typeof MantenimientoSchema>;

// CREATE
export const CreateMantenimientoSchema = MantenimientoSchema.omit({
  _id: true,
  correctora: true,
  dispositivo: true,
  cliente: true,
  usuario: true,
  unidadDeNegocio: true,
  centroOperativo: true,
  localidad: true,
  agrupacion: true,
  fechaCreacion: true,
}).extend({
  tipoAsignado: z.enum(["Correctora", "Dispositivo"]).optional(),
});
export type ICreateMantenimiento = z.infer<typeof CreateMantenimientoSchema>;

// UPDATE
export const UpdateMantenimientoSchema = MantenimientoSchema.omit({
  _id: true,
  fechaCreacion: true,
  correctora: true,
  dispositivo: true,
  cliente: true,
  usuario: true,
  unidadDeNegocio: true,
  centroOperativo: true,
  localidad: true,
  agrupacion: true,
}).extend({
  tipoAsignado: z.enum(["Correctora", "Dispositivo"]).optional(),
});
export type IUpdateMantenimiento = z.infer<typeof UpdateMantenimientoSchema>;
