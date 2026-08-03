import { z } from "zod";
import { DeviceInfoSchema } from "../auxiliares/deviceInfo";
import { TenantInfoGasSchema } from "../auxiliares/tenentInfo";
import { CorrectoraSchema } from "./correctora";
import { MedidorResidencialSchema } from "./medidor-residencial";
import { MedidorResidencialAguaSchema } from "./medidor-residencial-agua";
import { PuntoMedicionSchema } from "./punto-medicion";
import { UnidadPresionSchema } from "./unidad-presion";

export const TipoMensajeTwilioSchema = z.enum([
  "sms",
  "whatsapp",
  "llamada",
  "email", /// Email es sendgrid
]);
export type TipoMensajeTwilio = z.infer<typeof TipoMensajeTwilioSchema>;

export const LogTwilioSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  // Tentant
  tenant: TenantInfoGasSchema.optional(),
  // Datos del dispositivo
  device: DeviceInfoSchema.optional(),
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados: z.array(z.string()).optional(),
  // Datos especificos
  tipo: TipoMensajeTwilioSchema.optional(),
  mensaje: z.string().optional(),
  telefono: z.string().optional(),
  respuesta: z.record(z.string(), z.any()).optional(),

  email: z.string().optional(),

  // Virtuals
  puntoMedicion: PuntoMedicionSchema.optional(),
  correctora: CorrectoraSchema.optional(),
  unidadPresion: UnidadPresionSchema.optional(),
  medidorResidencial: MedidorResidencialSchema.optional(),
  medidorResidencialAgua: MedidorResidencialAguaSchema.optional(),
});
export type ILogTwilio = z.infer<typeof LogTwilioSchema>;

////// CREATE
// Nota: el `Omit` original incluía la clave "unidadPrsion" (typo) que no
// existe en ILogTwilio, por lo que nunca tuvo efecto — "unidadPresion"
// nunca se omitió realmente. Se preserva ese comportamiento.
export const CreateLogTwilioSchema = LogTwilioSchema.omit({
  _id: true,
  puntoMedicion: true,
  correctora: true,
  medidorResidencial: true,
});
export type ICreateLogTwilio = z.infer<typeof CreateLogTwilioSchema>;

////// UPDATE
export const UpdateLogTwilioSchema = LogTwilioSchema.omit({
  _id: true,
  puntoMedicion: true,
  correctora: true,
  medidorResidencial: true,
});
export type IUpdateLogTwilio = z.infer<typeof UpdateLogTwilioSchema>;
