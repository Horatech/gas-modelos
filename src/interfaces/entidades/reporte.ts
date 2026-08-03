import { z } from "zod";
import { DeviceInfoSchema } from "../auxiliares/deviceInfo";
import { TenantInfoGasSchema } from "../auxiliares/tenentInfo";
import { TipoInputDispositivoExternoSchema } from "./dispositivo-externo-nuc";
import type { ICorrectora } from "./correctora";
import type { IMedidorResidencial } from "./medidor-residencial";
import type { IMedidorResidencialAgua } from "./medidor-residencial-agua";
import type { IScada } from "./scada";
import type { IPuntoMedicion } from "./punto-medicion";
import type { IUnidadPresion } from "./unidad-presion";
import type { IValoresReporte } from "./valores-reporte/valoresReporte";
import type { IDispositivoExternoNuc } from "./dispositivo-externo-nuc";

export const ReporteTypesSchema = z.union([
  TipoInputDispositivoExternoSchema,
  z.enum(["Presion", "Residencial", "Residencial Agua", "Scada"]),
]);
export type reporteTypes = z.infer<typeof ReporteTypesSchema>;

// Populates intra-SCC (ICorrectora, IMedidorResidencial,
// IMedidorResidencialAgua, IScada, IPuntoMedicion, IUnidadPresion,
// IValoresReporte, IDispositivoExternoNuc) como z.custom: ver CLAUDE.md, "De
// solo tipos a schemas Zod".
export const ReporteSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  tenant: TenantInfoGasSchema.optional(),
  device: DeviceInfoSchema.optional(),
  idsAsignados: z.array(z.string()).optional(),
  idsAsignadosHash: z.string().optional(),
  valores: z.custom<IValoresReporte>().optional(),
  tipoReporte: ReporteTypesSchema.optional(),
  // Virtuals
  puntoMedicion: z.custom<IPuntoMedicion>().optional(),
  dispositivoExterno: z.custom<IDispositivoExternoNuc>().optional(),
  unidadPresion: z.custom<IUnidadPresion>().optional(),
  medidorResidencial: z.custom<IMedidorResidencial>().optional(),
  medidorResidencialAgua: z.custom<IMedidorResidencialAgua>().optional(),
  scada: z.custom<IScada>().optional(),
});

/**
 * Interface hand-written (mismo shape que el schema): parte del SCC de
 * IDispositivo, no usa z.infer.
 */
export interface IReporte {
  _id?: string;
  fechaCreacion?: string;
  tenant?: import("../auxiliares/tenentInfo").ITenantInfo;
  device?: import("../auxiliares/deviceInfo").IDeviceInfo;
  idsAsignados?: string[];
  idsAsignadosHash?: string;
  valores?: IValoresReporte;
  tipoReporte?: reporteTypes;
  // Virtuals
  puntoMedicion?: IPuntoMedicion;
  dispositivoExterno?: IDispositivoExternoNuc;
  unidadPresion?: IUnidadPresion;
  medidorResidencial?: IMedidorResidencial;
  medidorResidencialAgua?: IMedidorResidencialAgua;
  scada?: IScada;
}

////// CREATE
export const CreateReporteSchema = ReporteSchema.omit({
  _id: true,
  puntoMedicion: true,
  dispositivoExterno: true,
  medidorResidencial: true,
  medidorResidencialAgua: true,
  scada: true,
});
type Omitir =
  | "_id"
  | "puntoMedicion"
  | "dispositivoExterno"
  | "unidadPrsion"
  | "medidorResidencial"
  | "medidorResidencialAgua"
  | "scada";
export interface ICreateReporte extends Omit<Partial<IReporte>, Omitir> {}

export const UpdateReporteSchema = CreateReporteSchema;
export interface IUpdateReporte extends Omit<Partial<IReporte>, Omitir> {}
