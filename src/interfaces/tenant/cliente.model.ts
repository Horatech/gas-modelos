import { z } from "zod";
import { TipoDispositivoSchema } from "../auxiliares/tipoDispositivo";
import { ModeloCorrectoraSchema } from "../entidades/mensajes-nuc/mensajes-nuc";
// Import directo al archivo HOJA `entidades/estado.ts`, no a `entidades/correctora`
// ni al barrel: correctora → localidad → ClienteSchema cerraría un ciclo runtime.
import { EstadoCorrectoraSchema } from "../entidades/estado";
import { ImagenesClienteSchema } from "./cliente.dto";
import { IntegracionSchema } from "./integraciones";
import { DivisionSchema } from "./usuario/permiso";
import type { Division } from "./usuario/permiso";

export const TemplatesWhatsappSchema = z.enum([
  "Alerta de presión",
  "Punto de medición en mantenimiento",
  "Sensor de presión desconectado",
  "Error de comunicación de alarma",
  "Scada valor fuera de límite",
  "Scada valor fuera de límite genérico",
  "Scada valor reestablecido",
  "Scada booleano alarma",
  "Scada booleano reestablecido",
  "Scada error de comunicación con servidor",
  "Scada cambio de límites por fuera",
  "Equipos fuera de línea",
  "Batería baja",
]);
export type TemplatesWhatsapp = z.infer<typeof TemplatesWhatsappSchema>;

export const TemplatesMailSchema = z.union([
  TemplatesWhatsappSchema,
  z.enum(["Nuevo usuario", "Reset de contraseña", "Cambio de contraseña"]),
]);
export type TemplatesMail = z.infer<typeof TemplatesMailSchema>;

export const ApnSchema = z.object({
  apn: z.string().optional(),
  usuario: z.string().optional(),
  password: z.string().optional(),
});
export type IApn = z.infer<typeof ApnSchema>;

export const ConfigTwilioSchema = z.object({
  //Mensajes y llamadas
  accSid: z.string().optional(),
  authToken: z.string().optional(),
  msgServiceSid: z.string().optional(),
  statusCallback: z.string().optional(),
  phoneSms: z.string().optional(),
  phoneWhatsapp: z.string().optional(),
  phoneLlamada: z.string().optional(),
  templatesWhatsapp: z.partialRecord(TemplatesWhatsappSchema, z.string()).optional(),
  //Email
  senderEmail: z.string().optional(),
  senderName: z.string().optional(),
  senderAddress: z.string().optional(),
  senderCity: z.string().optional(),
  senderState: z.string().optional(),
  senderZip: z.number().optional(),
  sendGridApiKey: z.string().optional(),
  templatesMail: z.partialRecord(TemplatesMailSchema, z.string()).optional(),
});
export type IConfigTwilio = z.infer<typeof ConfigTwilioSchema>;

export const ConfigSincHorariaSchema = z.object({
  activo: z.boolean().optional(),
  desfaseMinimo: z.number().optional(),
  desfaseMaximo: z.number().optional(),
});
export type IConfigSincHoraria = z.infer<typeof ConfigSincHorariaSchema>;

export const ColumnaVistaPersonalizadaCorrectorasSchema = z.enum([
  "temperatura",
  "presion",
  "volumenBaseTotalizado",
  "volumenCorregidoTotalizado",
  "volumenBaseHorario",
  "volumenCorregidoHorario",
  "caudalPico",
  "caudalPromedio",
  "fpv",
]);
export type ColumnaVistaPersonalizadaCorrectoras = z.infer<typeof ColumnaVistaPersonalizadaCorrectorasSchema>;

export const ColumnaVistaPersonalizadaResidencialSchema = z.enum([
  "consumoInstantaneo", // Consumo Parcial
  "consumo", // Consumo Acumulado Dispositivo
  "consumoCorregido", // Consumo Acumulado Medidor
  "bateria", // Batería
]);
export type ColumnaVistaPersonalizadaResidencial = z.infer<typeof ColumnaVistaPersonalizadaResidencialSchema>;

export const ColumnaVistaPersonalizadaSchema = z.union([
  ColumnaVistaPersonalizadaCorrectorasSchema,
  ColumnaVistaPersonalizadaResidencialSchema,
]);
export type ColumnaVistaPersonalizada = z.infer<typeof ColumnaVistaPersonalizadaSchema>;

export const StatVistaPersonalizadaSchema = z.enum(["min", "max", "avg"]);
export type StatVistaPersonalizada = z.infer<typeof StatVistaPersonalizadaSchema>;

export const VistaPersonalizadaColumnaSchema = z.object({
  key: ColumnaVistaPersonalizadaSchema,
  label: z.string().optional(),
  stats: z.array(StatVistaPersonalizadaSchema).optional(),
  mostrarConsumo: z.boolean().optional(),
});
export type IVistaPersonalizadaColumna = z.infer<typeof VistaPersonalizadaColumnaSchema>;

/**
 * El orden de los elementos en el array `columnas` define el orden de
 * visualización y exportación de las columnas.
 */
export const VistaPersonalizadaFechaSchema = z.object({
  separar: z.boolean().optional(),
  formato: z.string().optional(),
  formatoFecha: z.string().optional(),
  formatoHora: z.string().optional(),
  label: z.string().optional(),
  labelFecha: z.string().optional(),
  labelHora: z.string().optional(),
});
export type IVistaPersonalizadaFecha = z.infer<typeof VistaPersonalizadaFechaSchema>;

export const VistaPersonalizadaCorrectorasSchema = z.object({
  activo: z.boolean(),
  columnas: z.array(VistaPersonalizadaColumnaSchema),
  agrupacion: z.enum(["hora", "dia"]),
  tipoDia: z.enum(["gas", "calendario"]).optional(),
  fecha: VistaPersonalizadaFechaSchema.optional(),
});
export type IVistaPersonalizadaCorrectoras = z.infer<typeof VistaPersonalizadaCorrectorasSchema>;

export const VistasPersonalizadasPorDivisionSchema = z.object({
  Correctoras: VistaPersonalizadaCorrectorasSchema.optional(),
  Residencial: VistaPersonalizadaCorrectorasSchema.optional(),
});
export type IVistasPersonalizadasPorDivision = z.infer<typeof VistasPersonalizadasPorDivisionSchema>;

export const ModuloCoberturaLorawanSchema = z.object({
  activo: z.boolean().optional(),
  verMetricas: z.boolean().optional(),
});
export type IModuloCoberturaLorawan = z.infer<typeof ModuloCoberturaLorawanSchema>;

export const ModuloClimaSchema = z.object({
  activo: z.boolean().optional(),
});
export type IModuloClima = z.infer<typeof ModuloClimaSchema>;

export const ParametrosObisSchema = z.object({
  reporteMask: z.number().optional(),
});
export type IParametrosObis = z.infer<typeof ParametrosObisSchema>;

/**
 * Catálogo FIJO de íconos de estado de punto de medición. Cada slug corresponde a
 * un asset existente en los frontends (`assets/estados/<slug>.png`) y trae su color
 * horneado: elegir el ícono elige también el color.
 *
 * El catálogo con asset + hex + variantes de card es un VALOR que sólo consumen los
 * frontends Angular, así que vive duplicado en gas-web-cliente y gas-web-admin; acá
 * sólo se declaran los slugs válidos.
 *
 * Ojo: `sin-reportar`, `resolver` y `sin-asignar` comparten exactamente el mismo
 * glifo (signo de admiración blanco) y se distinguen SÓLO por el color del círculo.
 */
export const IconoEstadoSchema = z.enum([
  "ok", // verde brillante  #02DA3D  check
  "incompleto", // verde oscuro     #168526  check + documento
  "sin-reportar", // rojo            #FF0000  !
  "resolver", // naranja         #F7931D  !
  "sin-asignar", // violeta         #7A1996  !
  "alerta", // amarillo        #FDED22  triángulo con !
  "mantenimiento", // celeste         #00B2D0  llave + destornillador
  "dado-de-baja", // casi negro      #2C2C2C  círculo tachado
  "sin-informacion", // rojo oscuro     #D0091D  X negra
]);
export type IconoEstado = z.infer<typeof IconoEstadoSchema>;

export type DivisionConVistaPersonalizada = Extract<
  Division,
  "Correctoras" | "Residencial"
>;

export const ConfigClienteSchema = z.object({
  apns: z.array(ApnSchema).optional(),
  usaLlm: z.boolean().optional(),
  tokensMensualesDisponibles: z.number().optional(),
  maximoUsuariosUsanLlm: z.number().optional(),
  twilio: ConfigTwilioSchema.optional(),
  sincHoraria: z.partialRecord(ModeloCorrectoraSchema, ConfigSincHorariaSchema).optional(),
  nucV3: z.boolean().optional(),
  sobreEscribirRegistrosNuc: z.boolean().optional(),
  valorAlarmaBateriaSml: z.number().optional(),
  puedeCrearDispositivos: z.boolean().optional(),
  vistasPersonalizadas: VistasPersonalizadasPorDivisionSchema.optional(),
  moduloCoberturaLorawan: ModuloCoberturaLorawanSchema.optional(),
  moduloClima: ModuloClimaSchema.optional(),
  parametrosObis: ParametrosObisSchema.optional(),
  permitirEditarUnNcoAsignado: z.boolean().optional(),
  crearMedidorResidencialAutomatico: z.boolean().optional(),
  gestionCuentas: z.boolean().optional(),
  /**
   * Ícono (y por lo tanto color) con el que el frontend muestra cada estado de punto
   * de medición: listados, detalle, popups del mapa, pines, clusters y cards de
   * Estado General.
   *
   * Opcional y parcial: los estados no definidos usan la asignación por defecto del
   * frontend (la actual, que es también el fallback). "Sin Comunicación", si no está
   * definido, hereda lo que resuelva "Sin Reportar" (es su alias visual en todo el
   * front).
   *
   * OJO: el merge de `config` en gas-admin (`clientes.service.ts updateCliente`) es
   * SHALLOW, así que el admin tiene que enviar el objeto `iconosEstado` COMPLETO en
   * cada PUT o pisa la config previa.
   */
  iconosEstado: z
    .partialRecord(EstadoCorrectoraSchema, IconoEstadoSchema)
    .optional(),
});
export type IConfigCliente = z.infer<typeof ConfigClienteSchema>;

// Populate intra-SCC (IImagenesCliente vive en cliente.dto.ts, que a su vez
// importa IConfigCliente de acá solo como tipo — ver cliente.dto.ts): esto no
// es un ciclo runtime porque cliente.dto.ts usa `import type` para lo que
// toma de este archivo. Ver CLAUDE.md, "De solo tipos a schemas Zod".
export const ClienteSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  activo: z.boolean().optional(),
  nombre: z.string().optional(),
  admin: z.boolean().optional(),
  imagenes: ImagenesClienteSchema.optional(),
  tiposDispositivo: z.array(TipoDispositivoSchema).optional(),
  integraciones: z.array(IntegracionSchema).optional(),
  config: ConfigClienteSchema.optional(),
});
export type ICliente = z.infer<typeof ClienteSchema>;

// Create/Update viven acá (no en cliente.dto.ts) para no necesitar el valor
// real de ClienteSchema desde cliente.dto.ts, que rompería el ciclo que se
// evita justo arriba. cliente.dto.ts re-exporta estos tipos (type-only) para
// mantener los paths de import de siempre.
//
// Definido explícito (no ClienteSchema.omit().required()): .required()
// encadenado no sobrevive portablemente al .d.ts consumido desde otro
// paquete (verificado con gas-datos vía CreateAuditoriaSchema — ver el
// comentario en gas/auditoria/create.ts).
export const CreateClienteSchema = z.object({
  activo: z.boolean().optional(),
  nombre: z.string(),
  admin: z.boolean().optional(),
  imagenes: ImagenesClienteSchema.optional(),
  tiposDispositivo: z.array(TipoDispositivoSchema).optional(),
  integraciones: z.array(IntegracionSchema).optional(),
  config: ConfigClienteSchema.optional(),
});
export type ICreateCliente = z.infer<typeof CreateClienteSchema>;

export const UpdateClienteSchema = ClienteSchema.omit({
  _id: true,
  fechaCreacion: true,
});
export type IUpdateCliente = z.infer<typeof UpdateClienteSchema>;
