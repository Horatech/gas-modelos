import { z } from "zod";
import { DeviceInfoSchema } from "../auxiliares/deviceInfo";
import { TenantInfoGasSchema } from "../auxiliares/tenentInfo";
import { CorrectoraSchema } from "./correctora";
import { MedidorResidencialSchema } from "./medidor-residencial";
import { MedidorResidencialAguaSchema } from "./medidor-residencial-agua";
import { PuntoMedicionSchema } from "./punto-medicion";
import { UnidadPresionSchema } from "./unidad-presion";
import { ValoresLogReporteSchema } from "./valores-log-reporte/valoresLogReporte";

export const LogReporteSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  // Tentant
  tenant: TenantInfoGasSchema.optional(),
  // Datos del dispositivo
  device: DeviceInfoSchema.optional(),
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados: z.array(z.string()).optional(),
  // Datos especificos de acuerdo al tipo de dispositivo
  valores: ValoresLogReporteSchema.optional(),

  // Virtuals
  puntoMedicion: PuntoMedicionSchema.optional(),
  correctora: CorrectoraSchema.optional(),
  unidadPresion: UnidadPresionSchema.optional(),
  medidorResidencial: MedidorResidencialSchema.optional(),
  medidorResidencialAgua: MedidorResidencialAguaSchema.optional(),
});
export type ILogReporte = z.infer<typeof LogReporteSchema>;

////// CREATE
// Nota: el `Omit` original incluía la clave "unidadPrsion" (typo) que no
// existe en ILogReporte, por lo que nunca tuvo efecto — "unidadPresion"
// nunca se omitió realmente. Se preserva ese comportamiento.
export const CreateLogReporteSchema = LogReporteSchema.omit({
  _id: true,
  puntoMedicion: true,
  correctora: true,
  medidorResidencial: true,
});
export type ICreateLogReporte = z.infer<typeof CreateLogReporteSchema>;

////// UPDATE
export const UpdateLogReporteSchema = LogReporteSchema.omit({
  _id: true,
  puntoMedicion: true,
  correctora: true,
  medidorResidencial: true,
});
export type IUpdateLogReporte = z.infer<typeof UpdateLogReporteSchema>;
