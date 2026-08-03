import { z } from "zod";

// Definido explícito (no derivado de AuditoriaSchema.omit().required()):
// encadenar .omit() + .required() infiere bien el tipo DENTRO de este repo,
// pero esa información se pierde al consumir el .d.ts compilado desde otro
// paquete (verificado con gas-datos: el campo volvía a verse opcional del
// otro lado) — limitación de portabilidad de Zod v4 con tipos derivados.
export const CreateAuditoriaSchema = z.object({
  entidad: z.string(),
  metodo: z.string(),
  dato: z.record(z.string(), z.any()),
  idUsuario: z.string(),
  idCliente: z.string(),
});
export type ICreateAuditoria = z.infer<typeof CreateAuditoriaSchema>;
