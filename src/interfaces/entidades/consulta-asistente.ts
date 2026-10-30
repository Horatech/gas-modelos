import { z } from "zod";

export const ResultadoConsultaAsistenteSchema = z.enum(["ok", "error"]);
export type ResultadoConsultaAsistente = z.infer<typeof ResultadoConsultaAsistenteSchema>;

export const FuenteAsistenteSchema = z.object({
  ruta: z.string(),
  titulo: z.string(),
});
export type IFuenteAsistente = z.infer<typeof FuenteAsistenteSchema>;

// Una herramienta que usó el asistente para responder: con qué la llamó y qué le devolvió (recortado). Sirve para
// auditar la respuesta y para que la pregunta siguiente de la misma charla vea lo que se consultó antes: sin
// esto el modelo recibía sólo su texto y desmentía consultas que sí había hecho.
export const HerramientaConsultaAsistenteSchema = z.object({
  nombre: z.string(),
  argumentos: z.record(z.string(), z.unknown()).optional(),
  resultado: z.string().optional(),
  esError: z.boolean().optional(),
});
export type IHerramientaConsultaAsistente = z.infer<typeof HerramientaConsultaAsistenteSchema>;

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
  // En el orden en que se llamaron.
  herramientas: z.array(HerramientaConsultaAsistenteSchema).optional(),
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
