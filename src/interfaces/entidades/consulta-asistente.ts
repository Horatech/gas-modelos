import { z } from "zod";

export const ResultadoConsultaAsistenteSchema = z.enum(["ok", "error"]);
export type ResultadoConsultaAsistente = z.infer<typeof ResultadoConsultaAsistenteSchema>;

export const FuenteAsistenteSchema = z.object({
  ruta: z.string(),
  titulo: z.string(),
});
export type IFuenteAsistente = z.infer<typeof FuenteAsistenteSchema>;

// Una pregunta al asistente de ayuda: qué se preguntó, qué respondió y cuánto consumió.
// El costo no se guarda: se calcula con los tokens y el precio del modelo, que cambia.
export const ConsultaAsistenteSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string(),
  idUsuario: z.string(),
  // Agrupa las preguntas de una misma charla; lo genera el front.
  idConversacion: z.string(),
  fecha: z.string().optional(),
  pregunta: z.string(),
  respuesta: z.string().optional(),
  fuentes: z.array(FuenteAsistenteSchema).optional(),
  modelo: z.string().optional(),
  tokensEntrada: z.number().nullable().optional(),
  tokensSalida: z.number().nullable().optional(),
  ms: z.number().optional(),
  resultado: ResultadoConsultaAsistenteSchema,
  error: z.string().optional(),
});
export type IConsultaAsistente = z.infer<typeof ConsultaAsistenteSchema>;

export const CreateConsultaAsistenteSchema = ConsultaAsistenteSchema.omit({ _id: true, fecha: true });
export type ICreateConsultaAsistente = z.infer<typeof CreateConsultaAsistenteSchema>;
