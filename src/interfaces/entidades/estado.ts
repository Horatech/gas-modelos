import { z } from "zod";

// Estado operativo de una entidad de medición (correctora, medidor residencial /
// de agua / eléctrico, unidad de presión, SCADA) y del punto de medición que las
// agrupa. Vive en un archivo HOJA (solo depende de zod) a propósito: lo consume
// `tenant/cliente.model.ts` (config.iconosEstado) y si estuviera en
// `correctora.ts` ese import cerraría un ciclo runtime real
// (correctora → localidad → ClienteSchema → correctora). Ver CLAUDE.md,
// "De solo tipos a schemas Zod".
export const EstadoCorrectoraSchema = z.enum([
  "Sin Asignar",
  "En Mantenimiento",
  "Resolver",
  "Sin Reportar",
  "Operativa",
  "Alerta",
  "Sin Comunicación",
  "Dado de Baja",
  "Incompleto",
]);
export type IEstado = z.infer<typeof EstadoCorrectoraSchema>;
