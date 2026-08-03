import { z } from "zod";
import { CuencaSchema } from "../entidades/cuenca";
import { GrupoSchema } from "../entidades/grupo";
import { LocalidadSchema } from "../entidades/localidad";
import { AgrupacionSchema } from "../gas/agrupacion/schema";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { ClienteSchema } from "../tenant/cliente.model";

// export interface ITenantInfoAgro {
//   idCliente?: string;
//   idEstablecimiento?: string;
//   //
//   cliente?: ICliente;
//   establecimiento?: IEstablecimiento;
// }

export const TenantInfoGasSchema = z.object({
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
  idCuenca: z.string().optional(),
  idsAgrupaciones: z.array(z.string()).optional(),
  idsGrupos: z.array(z.string()).optional(),
  // Virtual
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
  cuenca: CuencaSchema.optional(),
  agrupaciones: z.array(AgrupacionSchema).optional(),
  grupos: z.array(GrupoSchema).optional(),
});
export type ITenantInfoGas = z.infer<typeof TenantInfoGasSchema>;

export type ITenantInfo =
  // ITenantInfoAgro |
  ITenantInfoGas;
