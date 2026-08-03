import { z } from "zod";
import { TipoDispositivoSchema } from "../../auxiliares/tipoDispositivo";
import { ClienteSchema } from "../../tenant/cliente.model";
import {
  ConfigDispositivoSchema,
  TipoEdgeDeteccionSchema,
  TipoEntradaDigitalSchema,
} from "../config-dispositivo";
import { DispositivoSchema } from "../dispositivo";

// Metadatos de auditoría (sin cambios)
export const AuditoriaConfigGpioSchema = z.object({
  usuarioId: z.string(),
  nombreUsuario: z.string(),
});
export type IAuditoriaConfigGpio = z.infer<typeof AuditoriaConfigGpioSchema>;

// Cada documento es una entrada individual de timeline
export const GpioConfigNucAuditoriaSchema = z.object({
  _id: z.string().optional(), // ObjectId generado por MongoDB
  fechaCreacion: z.string().optional(), // Fecha de creación de esta entrada (opcional)

  // Campos de timeline (de ITimelineEntry)
  fechaInicio: z.string(), // Fecha del inicio del cambio (ISO 8601) - NO opcional
  fechaFin: z.string().optional(), // Si es null/undefined, esta configuración sigue activa
  activo: z.boolean(), // true si es la configuración actual activa (fechaFin == null)
  type: TipoEntradaDigitalSchema, // El tipo asignado
  edgeType: TipoEdgeDeteccionSchema.optional(), // Tipo de detección
  auditoria: AuditoriaConfigGpioSchema.optional(), // Metadatos de auditoría

  // Distingue canal
  canal: z.enum(["IN1", "IN2"]), // Indica el canal GPIO

  // Tenant y referencias
  idCliente: z.string().optional(),
  idDispositivo: z.string(),
  idConfigDispositivo: z.string().optional(), // El _id de IConfigDispositivo que disparó este cambio
  tipoDispositivo: TipoDispositivoSchema.optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  dispositivo: DispositivoSchema.optional(),
  configDispositivo: ConfigDispositivoSchema.optional(),
});
export type IGpioConfigNucAuditoria = z.infer<typeof GpioConfigNucAuditoriaSchema>;

// CREATE: Omitir campos autogenerados
// Nota: el original envolvía con `Partial<...>` antes del Omit, por eso acá
// se encadena `.partial()`: todos los campos quedan opcionales en Create/Update.
export const CreateGpioConfigNucAuditoriaSchema = GpioConfigNucAuditoriaSchema.omit({
  _id: true,
  dispositivo: true,
  cliente: true,
  configDispositivo: true,
}).partial();
export type ICreateGpioConfigNucAuditoria = z.infer<
  typeof CreateGpioConfigNucAuditoriaSchema
>;

// UPDATE: Similar, pero parcial
export const UpdateGpioConfigNucAuditoriaSchema = GpioConfigNucAuditoriaSchema.omit({
  _id: true,
  dispositivo: true,
  cliente: true,
  configDispositivo: true,
}).partial();
export type IUpdateGpioConfigNucAuditoria = z.infer<
  typeof UpdateGpioConfigNucAuditoriaSchema
>;
