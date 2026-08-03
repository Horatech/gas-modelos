import { z } from "zod";
import { AgrupacionSchema as GasAgrupacionSchema } from "../gas/agrupacion/schema";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { UsuarioSchema } from "../tenant/usuario/schema";
import { GrupoSchema } from "./grupo";
import { LocalidadSchema } from "./localidad";

// Nombre distinto de TipoAlertaSchema (alerta.ts): categorías de alerta que
// disparan un envío de notificación, no el tipo de la entidad IAlerta.
export const TipoAlertaEnvioSchema = z.enum([
  "Unidades Presión - Fuera de límite",
  "Unidades Presión - Error en reporte de alarma",
  "Unidades Presión - Sensor desconectado",
  "SCADA - Fuera de límite",
  "SCADA - Cambio de límite",
  "SCADA - Equipos fuera de línea",
  "NSP - Equipos fuera de línea",
  "NUC - Equipos fuera de línea",
  "VERIBOX - Equipos fuera de línea",
  "NUC - Batería baja",
  "VERIBOX - Batería baja",
  "NSP - Batería baja",
  "SCADA - Error de comunicación con servidor",
]);
export type TipoAlertaEnvio = z.infer<typeof TipoAlertaEnvioSchema>;

export const TipoEnvioSchema = z.enum([
  "SMS",
  "WhatsApp",
  "Llamada",
  "Notificacion Push",
  "Email",
]);
export type TipoEnvio = z.infer<typeof TipoEnvioSchema>;

// Agrupacion de destinatarios del envío (distinta de IAgrupacion, la entidad de "../gas")
export const AgrupacionEnvioSchema = z.enum([
  "Global",
  "Unidad de Negocio",
  "Centro Operativo",
  "Grupo",
  "Agrupacion",
  "Localidad",
]);
export type AgrupacionEnvio = z.infer<typeof AgrupacionEnvioSchema>;

export const ConfigEnvioSmsSchema = z.object({
  // Para Equipos fuera de línea
  porcentaje: z.number().optional(),
});
export type IConfigEnvioSms = z.infer<typeof ConfigEnvioSmsSchema>;

export const EnvioSmsSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),

  agrupacion: AgrupacionEnvioSchema.optional(),
  tipoEnvio: TipoEnvioSchema.optional(),

  // Condiciones de envio
  tiposAlerta: z.array(TipoAlertaEnvioSchema).optional(),
  config: ConfigEnvioSmsSchema.optional(),

  // Mensaje
  mensaje: z.string().optional(),

  // Fechas
  fechaCreacion: z.date().optional(),
  fechaEnvio: z.date().nullable().optional(),

  // Referencias

  idUnidadNegocio: z.string().nullable().optional(),
  idCentroOperativo: z.string().nullable().optional(),
  idGrupo: z.string().nullable().optional(),
  idAgrupacion: z.string().nullable().optional(),
  idLocalidad: z.string().nullable().optional(),

  idsUsuarios: z.array(z.string()).optional(),

  // Virtual
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  grupo: GrupoSchema.optional(),
  agrupacion2: GasAgrupacionSchema.optional(),
  localidad: LocalidadSchema.optional(),
  usuarios: z.array(UsuarioSchema).optional(),
});
export type IEnvioSms = z.infer<typeof EnvioSmsSchema>;

const omitir = {
  _id: true,
  unidadNegocio: true,
  centroOperativo: true,
  grupo: true,
  agrupacion2: true,
  localidad: true,
  usuarios: true,
} as const;

export const CreateEnvioSmsSchema = EnvioSmsSchema.omit(omitir);
export type ICreateEnvioSms = z.infer<typeof CreateEnvioSmsSchema>;

export const UpdateEnvioSmsSchema = EnvioSmsSchema.omit(omitir);
export type IUpdateEnvioSms = z.infer<typeof UpdateEnvioSmsSchema>;
