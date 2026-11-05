import { z } from "zod";
import { BloquesRespuestaSchema } from "./bloque-asistente";

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

// Pedidos de seguimiento que propone el asistente al final de una respuesta con datos ("Mostrame los registros de
// hoy"). El chat los muestra como botones al pie de la última respuesta y el texto viaja tal cual como la pregunta
// siguiente. Los propone el modelo: gas-api-cliente los valida con este schema y descarta los que no pasan.
export const MAX_SUGERENCIAS_ASISTENTE = 3;
export const SugerenciaAsistenteSchema = z.string().trim().min(3).max(80);
export const SugerenciasAsistenteSchema = z
  .array(SugerenciaAsistenteSchema)
  .max(MAX_SUGERENCIAS_ASISTENTE)
  .refine((ss) => new Set(ss.map((s) => s.toLowerCase())).size === ss.length, { message: "sugerencia repetida" });
export type ISugerenciasAsistente = z.infer<typeof SugerenciasAsistenteSchema>;

// La valoración que deja el usuario sobre una respuesta (las manitos al pie): sirve para revisar qué esperaba y qué
// recibió. El comentario va sólo con el voto negativo («¿Qué esperabas?») y es opcional.
export const VotoAsistenteSchema = z.enum(["positivo", "negativo"]);
export type VotoAsistente = z.infer<typeof VotoAsistenteSchema>;
export const MAX_COMENTARIO_VALORACION_ASISTENTE = 1000;
const ComentarioValoracionSchema = z
  .string()
  .trim()
  .max(MAX_COMENTARIO_VALORACION_ASISTENTE)
  .transform((s) => s || undefined)
  .optional();

export const ValoracionAsistenteSchema = z.object({
  voto: VotoAsistenteSchema,
  comentario: z.string().optional(),
  // La pone gas-datos al guardarla; la última vale (el usuario puede cambiar el voto).
  fecha: z.string().optional(),
});
export type IValoracionAsistente = z.infer<typeof ValoracionAsistenteSchema>;

// Lo que manda el chat al votar. `voto: null` saca la valoración. Un comentario vacío cuenta como ausente.
export const PedidoValoracionAsistenteSchema = z
  .object({
    voto: VotoAsistenteSchema.nullable(),
    comentario: ComentarioValoracionSchema,
  })
  .refine((p) => p.voto === "negativo" || p.comentario === undefined, {
    message: "el comentario va sólo con el voto negativo",
    path: ["comentario"],
  });
export type IPedidoValoracionAsistente = z.input<typeof PedidoValoracionAsistenteSchema>;

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
  // Los bloques que referencia `respuesta` con `{{bloque:<id>}}`, cada uno devuelto por una herramienta de esta
  // consulta. Ausente en las consultas anteriores a los bloques: esas se muestran como texto.
  bloques: BloquesRespuestaSchema.optional(),
  // Ausente en las respuestas sin sugerencias y en las anteriores a ellas.
  sugerencias: SugerenciasAsistenteSchema.optional(),
  modelo: z.string().optional(),
  tokensEntrada: z.number().nullable().optional(),
  tokensSalida: z.number().nullable().optional(),
  ms: z.number().optional(),
  resultado: ResultadoConsultaAsistenteSchema,
  error: z.string().optional(),
  // Ausente mientras el usuario no votó la respuesta.
  valoracion: ValoracionAsistenteSchema.optional(),
});
export type IConsultaAsistente = z.infer<typeof ConsultaAsistenteSchema>;

// La valoración no viaja al registrar la consulta: llega después, por su propio pedido.
export const CreateConsultaAsistenteSchema = ConsultaAsistenteSchema.omit({ _id: true, fecha: true, valoracion: true });
export type ICreateConsultaAsistente = z.infer<typeof CreateConsultaAsistenteSchema>;

// Largo del título de una conversación en el listado: la primera pregunta, recortada.
export const MAX_TITULO_CONVERSACION_ASISTENTE = 80;
// Tope de conversaciones por página del listado.
export const MAX_CONVERSACIONES_ASISTENTE = 100;

// Una conversación del usuario con el asistente, para la lista de conversaciones del chat. No se guarda: sale de
// agrupar sus consultas (las que terminaron bien) por `idConversacion`.
export const ConversacionAsistenteSchema = z.object({
  idConversacion: z.string(),
  // La primera pregunta, recortada a MAX_TITULO_CONVERSACION_ASISTENTE.
  titulo: z.string(),
  // Fecha de la primera y de la última consulta.
  inicio: z.string(),
  ultima: z.string(),
  // Cantidad de consultas (preguntas con su respuesta).
  turnos: z.number().int().min(1),
  // Alguna respuesta trae un bloque `seguimiento` en `modo: "vivo"`: al abrirla, el chat lo reanuda.
  conSeguimiento: z.boolean(),
});
export type IConversacionAsistente = z.infer<typeof ConversacionAsistenteSchema>;

// Página del listado, de la más reciente a la más vieja. `antes` es la `ultima` de la última conversación de la
// página anterior (ISO); sin ella, desde la más reciente.
export const PedidoConversacionesAsistenteSchema = z.object({
  limit: z.coerce.number().int().min(1).max(MAX_CONVERSACIONES_ASISTENTE).optional(),
  antes: z.string().optional(),
});
export type IPedidoConversacionesAsistente = z.infer<typeof PedidoConversacionesAsistenteSchema>;
