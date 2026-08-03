import { z } from "zod";

/// EXTRAS
//
// (definidos primero: SetReporte/SetReporteV3 dependen de UcvSchema como valor
// runtime, y en Zod —a diferencia de los tipos, que TS resuelve por adelantado—
// el orden de declaración de los `const` importa)

/**
 * Reemplazo del enum numérico nativo `ucv` (TypeScript `enum ucv {...}`). Un
 * enum numérico real emite un objeto en runtime; acá se modela como unión de
 * literales + Schema, sin dejar ningún valor gratis en el build.
 */
export const UcvSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
]);
export type ucv = z.infer<typeof UcvSchema>;

/**
 * Nombres simbólicos del enum numérico original (`ucv.Corus`, etc.). Ningún
 * consumidor de este repo los usa hoy (solo se usa `ucv` como type), pero se
 * deja el mapa por si hace falta legibilidad en el futuro.
 */
export const UCV = {
  Nada: 0,
  Corus: 1,
  Dresser1: 2,
  Dresser2: 3,
  Proser: 4,
  Mercury: 5,
  Minicor: 6,
  AmericanMeter: 7,
  Elcor: 8,
} as const;

export const ModeloCorrectoraSchema = z.enum([
  "Nada",
  "Corus",
  "Dresser1",
  "Dresser2",
  "Proser",
  "Mercury",
  "Minicor",
  "AmericanMeter",
  "Elcor",
  "Instromet",
]);
export type ModeloCorrectora = z.infer<typeof ModeloCorrectoraSchema>;

/// SETS

export const SetAlertaSchema = z.object({
  deveui: z.string(),
  appkey: z.string(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
  codigo: z.number(),
});
export type ISetAlerta = z.infer<typeof SetAlertaSchema>;

export const SetAlertaV2Schema = z.object({
  deveui: z.string(),
  appkey: z.string(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
  codigo: z.number().optional(),
  alarmasMercury: z.string().optional(),
});
export type ISetAlertaV2 = z.infer<typeof SetAlertaV2Schema>;

export const SetConfiguracionSchema = z.object({
  deveui: z.string(),
  appkey: z.string(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
  frecuenciaComunicacion: z.number(),
  horaInicio: z.number(),
  modoOperacion: z.string(),
  redPreferida: z.string(),
});
export type ISetConfiguracion = z.infer<typeof SetConfiguracionSchema>;

export const SetConfiguracionV2Schema = z.object({
  deveui: z.string().optional(),
  appkey: z.string().optional(),
  firmwareNuc: z.string().optional(),
  apiVersion: z.string().optional(),
  horaInicio: z.number().optional(),
  modoOperacion: z.enum(["REG1_DIARIO", "REG24_DIARIO", "REG8_8HORAS"]).optional(),
  modoEnv: z.enum(["TEST", "PROD"]).optional(),
  claveMercury: z.string().optional(),
  modoRegistros: z.enum(["REG_TOTALIZADOS", "REG_PARCIALES"]).optional(),
  nsa: z.number().optional(), // Numero de serie de american meter
  // Teléfonos para alertas SMS (NUC v2.0)
  telefono1: z.string().optional(), // Formato: +54XXXXXXXXXXX (13 caracteres)
  telefono2: z.string().optional(), // Formato: +54XXXXXXXXXXX (13 caracteres)
  telefono3: z.string().optional(), // Formato: +54XXXXXXXXXXX (13 caracteres)
  // Configuración GPIO (NUC v2.0)
  tipo_input_1: z.number().optional(),
  tipo_edge_input_1: z.number().optional(), // Tipo de detección de flanco (0-5)
  tipo_input_2: z.number().optional(),
  tipo_edge_input_2: z.number().optional(), // Tipo de detección de flanco (0-5)
});
export type ISetConfiguracionV2 = z.infer<typeof SetConfiguracionV2Schema>;

export const SetCorrectoraSchema = z.object({
  deveui: z.string(),
  appkey: z.string(),
  numeroSerieCorrectora: z.number(),
  firmwareCorrectora: z.string().optional(),
  numeroCorrectora: z.number().optional(),
});
export type ISetCorrectora = z.infer<typeof SetCorrectoraSchema>;

export const SetCorrectoraV3Schema = z.object({
  deveui: z.string(),
  appkey: z.string(),
  numeroSerieCorrectora: z.number(),
  firmwareCorrectora: z.string().optional(),
  numeroCorrectora: z.number().optional(),
  bateria: z.string().optional(),
});
export type ISetCorrectoraV3 = z.infer<typeof SetCorrectoraV3Schema>;

export const SetCromatografiaSchema = z.object({
  idCromatografia: z.string(),
  aplicada: z.boolean(),
  numeroSerieCorrectora: z.number(),
  // Tambien llega esto
  deveui: z.string(),
  appkey: z.string(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
});
export type ISetCromatografia = z.infer<typeof SetCromatografiaSchema>;

export const SetRegistroSchema = z.object({
  deveui: z.string(),
  timestamp: z.number(),
  corrected: z.number().optional(),
  uncorrected: z.number().optional(),
  presion: z.number().optional(),
  temperatura: z.number().optional(),
  contador: z.number().optional(),
  bateria: z.number().optional(),
});
export type ISetRegistro = z.infer<typeof SetRegistroSchema>;

export const SetRegistroV3Schema = z.object({
  deveui: z.string(),
  timestamp: z.number(),
  correctedTotalizado: z.number().optional(),
  uncorrectedTotalizado: z.number().optional(),
  correctedParcializado: z.number().optional(),
  uncorrectedParcializado: z.number().optional(),
  caudalCorregido: z.number().optional(),
  caudalNoCorregido: z.number().optional(),
  presionPromedio: z.number().optional(),
  temperaturaPromedio: z.number().optional(),
  bateria: z.number().optional(),
});
export type ISetRegistroV3 = z.infer<typeof SetRegistroV3Schema>;

export const SetReporteSchema = z.object({
  registros: z.array(SetRegistroSchema),
  recuperado: z.boolean(),
  deveui: z.string(),
  deviceName: z.string(),
  appkey: z.string(),
  bateria: z.string(),
  numeroCorrectora: UcvSchema,
  numeroSerieCorrectora: z.number(),
  firmwareNuc: z.string(),
  firmwareCorrectora: z.string(),
  apiVersion: z.string(),
});
export type ISetReporte = z.infer<typeof SetReporteSchema>;

export const SetReporteV3Schema = z.object({
  registros: z.array(SetRegistroV3Schema),
  recuperado: z.boolean(),
  deveui: z.string(),
  deviceName: z.string(),
  appkey: z.string(),
  bateria: z.string(),
  numeroCorrectora: UcvSchema,
  numeroSerieCorrectora: z.number(),
  firmwareNuc: z.string(),
  firmwareCorrectora: z.string(),
  apiVersion: z.string(),
});
export type ISetReporteV3 = z.infer<typeof SetReporteV3Schema>;

/// GETS
export const GetConfiguracionV2Schema = z.object({
  deveui: z.string().optional(),
  appkey: z.string().optional(),
  numeroSerieCorrectora: z.number(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
});
export type IGetConfiguracionV2 = z.infer<typeof GetConfiguracionV2Schema>;

export const GetCromatografiaSchema = z.object({
  deveui: z.string().optional(),
  appkey: z.string().optional(),
  numeroSerieCorrectora: z.number(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
});
export type IGetCromatografia = z.infer<typeof GetCromatografiaSchema>;

export const ResponseGetCromatografiaSchema = z.object({
  _id: z.string(),
  oxigeno: z.number().optional(),
  densidad: z.number().optional(),
  dioxidoCarbono: z.number().optional(),
  nitrogeno: z.number().optional(),
  metano: z.number().optional(),
  etano: z.number().optional(),
  propano: z.number().optional(),
  isoButano: z.number().optional(),
  nButano: z.number().optional(),
  isoPentano: z.number().optional(),
  nPentano: z.number().optional(),
  nHexano: z.number().optional(),
  nHeptano: z.number().optional(),
  nOctano: z.number().optional(),
});
export type IResponseGetCromatografia = z.infer<
  typeof ResponseGetCromatografiaSchema
>;

export const GetRegistroSchema = z.object({
  deveui: z.string().optional(),
  appkey: z.string().optional(),
  numeroSerieCorrectora: z.number(),
  numeroCorrectora: z.number(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
});
export type IGetRegistro = z.infer<typeof GetRegistroSchema>;

export const ResponseGetRegistroSchema = z.object({
  registros: z.array(z.number()),
});
export type IResponseGetRegistro = z.infer<typeof ResponseGetRegistroSchema>;

export const SyncHoraSchema = z.object({
  deveui: z.string().optional(),
  appkey: z.string().optional(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
  timestamp: z.number().optional(),
  forzarSync: z.boolean().optional(), // Fuerza respuesta del servidor independiente de configuración
});
export type ISyncHora = z.infer<typeof SyncHoraSchema>;

/// GPIO - NUC v2.0
// - Testigos de inputs
export const SetReporteGpioSchema = z.object({
  deveui: z.string(),
  appkey: z.string(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
  data_ios: z.object({
    contador_1: z.number().optional(),
    contador_2: z.number().optional(),
    testigo_1: z.number().optional(), // 0 o 1 según firmware
    testigo_2: z.number().optional(), // 0 o 1 según firmware
  }),
});
export type ISetReporteGpio = z.infer<typeof SetReporteGpioSchema>;

export const SetAlertaGpioSchema = z.object({
  deveui: z.string(),
  appkey: z.string(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
  alerta: z.object({
    input: z.union([z.literal(1), z.literal(2)]),
  }),
});
export type ISetAlertaGpio = z.infer<typeof SetAlertaGpioSchema>;

export const SetRegistrosInputsSchema = z.object({
  deveui: z.string(),
  appkey: z.string(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
  reg_ios: z.array(z.tuple([z.number(), z.number(), z.number()])), // Array of [timestamp, contador_input_1, contador_input_2]
  recuperado: z.boolean().optional(), // Indica si los registros son recuperados o no
});
export type ISetRegistrosInputs = z.infer<typeof SetRegistrosInputsSchema>;

export const GetRegistrosInputsSchema = z.object({
  deveui: z.string(),
  appkey: z.string(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
});
export type IGetRegistrosInputs = z.infer<typeof GetRegistrosInputsSchema>;

export const ResponseGetRegistrosInputsSchema = z.object({
  registros: z.array(z.number()), // Array of [timestamps, timestamps...]
});
export type IResponseGetRegistrosInputs = z.infer<
  typeof ResponseGetRegistrosInputsSchema
>;

export const InputsFlagSchema = z.object({
  deveui: z.string(),
  appkey: z.string(),
  firmwareNuc: z.string(),
  apiVersion: z.string(),
  flag_ios: z.object({
    // Siempre llega como 1 si hay mensaje sino no hay mensaje de testigo.
    testigo_1: z.number().optional(),
    estado_actual_1: z.number().optional(),
    testigo_2: z.number().optional(),
    estado_actual_2: z.number().optional(),
  }),
});
export type IInputsFlag = z.infer<typeof InputsFlagSchema>;

// Nombre distinto de TipoMensajeSchema (LLM/chat-tipos.ts): tipo de mensaje
// del protocolo NUC, no el rol de un mensaje de chat LLM.
export const TipoMensajeNucSchema = z.enum([
  "ISetAlerta",
  "ISetAlertaV2",
  "ISetConfiguracion",
  "ISetConfiguracionV2",
  "ISetCorrectora",
  "ISetCorrectoraV3",
  "ISetCromatografia",
  "ISetRegistro",
  "ISetRegistroV3",
  "ISetReporte",
  "ISetReporteV3",
  "IGetConfiguracionV2",
  "IGetCromatografia",
  "IGetRegistro",
  "ISyncHora",
  "ISetReporteGpio",
  "ISetAlertaGpio",
  "ISetRegistrosInputs",
  "IGetRegistrosInputs",
  "IInputsFlag",
]);
export type TipoMensajeNuc = z.infer<typeof TipoMensajeNucSchema>;
