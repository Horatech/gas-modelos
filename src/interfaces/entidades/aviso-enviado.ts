import { z } from "zod";

export const CanalAvisoSchema = z.enum([
  "campanita",
  "push",
  "sms",
  "whatsapp",
  "llamada",
  "email",
]);
export type CanalAviso = z.infer<typeof CanalAvisoSchema>;

export const ResultadoAvisoSchema = z.enum([
  "enviado",
  "fallido",
  "tope",
  "sinDestino",
]);
export type ResultadoAviso = z.infer<typeof ResultadoAvisoSchema>;

export const ReglaAvisoSchema = z.object({
  tipo: z.enum([
    "configNotificacion",
    "envioSms",
    "perfil",
    "tarea",
    "mantenimiento",
  ]),
  id: z.string().optional(),
});
export type IReglaAviso = z.infer<typeof ReglaAvisoSchema>;

// Contexto que el llamador adjunta al pedir un envio; lo copia cada canal al
// registro de avisos enviados.
export const RegistroAvisoSchema = z.object({
  origen: z.string(),
  idCliente: z.string().optional(),
  idUsuario: z.string().optional(),
  idAlerta: z.string().optional(),
  idPuntoMedicion: z.string().optional(),
  tipoAlerta: z.string().optional(),
  reglas: z.array(ReglaAvisoSchema).optional(),
  idTarea: z.string().optional(),
});
export type IRegistroAviso = z.infer<typeof RegistroAvisoSchema>;

// Definido explicito (sin .omit().required()): ver gas/auditoria/create.ts.
export const AvisoEnviadoSchema = z.object({
  _id: z.string().optional(),
  fecha: z.string().optional(),
  origen: z.string().optional(),
  idCliente: z.string().optional(),
  idUsuario: z.string().optional(),
  idAlerta: z.string().optional(),
  idPuntoMedicion: z.string().optional(),
  tipoAlerta: z.string().optional(),
  reglas: z.array(ReglaAvisoSchema).optional(),
  idTarea: z.string().optional(),
  canal: CanalAvisoSchema,
  resultado: ResultadoAvisoSchema,
  error: z.string().optional(),
  destino: z.string().optional(),
  titulo: z.string().optional(),
  mensaje: z.string().optional(),
  idNotificacion: z.string().optional(),
  idExterno: z.string().optional(),
});
export type IAvisoEnviado = z.infer<typeof AvisoEnviadoSchema>;

export const CreateAvisoEnviadoSchema = AvisoEnviadoSchema.omit({ _id: true });
export type ICreateAvisoEnviado = z.infer<typeof CreateAvisoEnviadoSchema>;
