import { z } from "zod";

/**
 * Metadatos del modelo generado por LangChain
 */
export const MetadataModeloSchema = z.object({
  model: z.string(),
  total_duration: z.number(),
  load_duration: z.number(),
  prompt_eval_count: z.number(),
  prompt_eval_duration: z.number(),
  eval_count: z.number(),
  eval_duration: z.number(),
  input_tokens: z.number(),
  output_tokens: z.number(),
  done_reason: z.string(),
  done: z.boolean(),
});
export type IMetadataModelo = z.infer<typeof MetadataModeloSchema>;
