import { z } from "zod";
import { CuencaSchema } from "../../entidades/cuenca";
import { LocalidadSchema } from "../../entidades/localidad";
import { AgrupacionSchema } from "../../gas/agrupacion/schema";
import { CentroOperativoSchema } from "../../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../../gas/unidadNegocio/schema";

export const RolSchema = z.enum([
  "Administrador",
  "Usuario",
  "Croma",
  "Visualizar",
  "Laboratorista",
  "TecnicoCampo",
]);
export type Rol = z.infer<typeof RolSchema>;

export const NivelSchema = z.enum([
  "Global",
  "Unidad de Negocio",
  "Centro Operativo",
  "Localidad",
  "Agrupación",
]);
export type Nivel = z.infer<typeof NivelSchema>;

export const DivisionSchema = z.enum([
  "Correctoras",
  "Presión",
  "Residencial",
  "Residencial Agua",
  "SCADA Unifilares",
  "SCADA Mediciones",
  "Dispositivo Externo NUC",
  "Medidores Eléctricos",
]);
export type Division = z.infer<typeof DivisionSchema>;

export const PermisoSchema = z.object({
  nivel: NivelSchema.optional(),
  division: DivisionSchema.optional(),
  rol: RolSchema.optional(),
  idsUnidadNegocios: z.array(z.string()).optional(),
  idsCentroOperativos: z.array(z.string()).optional(),
  idsLocalidades: z.array(z.string()).optional(),
  idsCuencas: z.array(z.string()).optional(),
  idsAgrupaciones: z.array(z.string()).optional(),
  usaLlm: z.boolean().optional(),
  // Populate
  unidadNegocios: z.array(UnidadNegocioSchema).optional(),
  centroOperativos: z.array(CentroOperativoSchema).optional(),
  localidades: z.array(LocalidadSchema).optional(),
  cuencas: z.array(CuencaSchema).optional(),
  agrupaciones: z.array(AgrupacionSchema).optional(),
});
export type IPermiso = z.infer<typeof PermisoSchema>;
