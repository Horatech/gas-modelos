import { z } from "zod";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { UsuarioSchema } from "../tenant/usuario/schema";
import { CorrectoraSchema } from "./correctora";
import { DispositivoSchema } from "./dispositivo";
import { LocalidadSchema } from "./localidad";
import { MedidorResidencialSchema } from "./medidor-residencial";
import { ScadaSchema } from "./scada";
import { UnidadPresionSchema } from "./unidad-presion";

export const EntidadesSchema = z.enum([
  "Dispositivo",
  "Correctora",
  "Unidad de Presión",
  "Scada",
  "Medidor Residencial",
  "Unidad de Negocio",
  "Centro Operativo",
  "Localidad",
]);
export type IEntidades = z.infer<typeof EntidadesSchema>;

export const AsignacionSchema = z.object({
  _id: z.string().optional(),
  //
  idCliente: z.string().optional(),
  fechaCreacion: z.string().optional(),
  idUsuario: z.string().optional(),
  // Entidad Modificada
  tipoEntidadModificada: EntidadesSchema.optional(),
  idEntidadModificada: z.string().optional(),
  nombreEntidadModificada: z.string().optional(),
  // Entidad que se le asigna
  tipoEntidadAsignada: EntidadesSchema.optional(),
  idEntidadAsignada: z.string().optional(),
  nombreEntidadAsignada: z.string().optional(),

  // Populate
  dispositivoAsignado: DispositivoSchema.optional(),
  correctoraAsignada: CorrectoraSchema.optional(),
  unidadPresionAsignada: UnidadPresionSchema.optional(),
  scadaAsignado: ScadaSchema.optional(),
  medidorResidencialAsignado: MedidorResidencialSchema.optional(),
  unidadNegocioAsignado: UnidadNegocioSchema.optional(),
  centroOperativoAsignado: CentroOperativoSchema.optional(),
  localidadAsignada: LocalidadSchema.optional(),
  usuario: UsuarioSchema.optional(),
});
export type IAsignacion = z.infer<typeof AsignacionSchema>;

////// CREATE / UPDATE (mismo set de campos omitidos)
const omitir = {
  _id: true,
  dispositivoAsignado: true,
  correctoraAsignada: true,
  unidadPresionAsignada: true,
  scadaAsignado: true,
  medidorResidencialAsignado: true,
  unidadNegocioAsignado: true,
  centroOperativoAsignado: true,
  localidadAsignada: true,
  usuario: true,
} as const;

export const CreateAsignacionSchema = AsignacionSchema.omit(omitir);
export type ICreateAsignacion = z.infer<typeof CreateAsignacionSchema>;

export const UpdateAsignacionSchema = AsignacionSchema.omit(omitir);
export type IUpdateAsignacion = z.infer<typeof UpdateAsignacionSchema>;
