import { z } from "zod";
import { DivisionSchema } from "../../tenant/usuario/permiso";

export const IndicadorHistoricoSchema = z.object({
  _id: z.string().optional(),
  fecha: z.string().optional(), // "2026-03-30"
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().nullable().optional(),
  idCentroOperativo: z.string().nullable().optional(),
  idLocalidad: z.string().nullable().optional(),
  division: DivisionSchema.optional(),

  // Nivel UN — mismo valor para todos los docs de esa UN ese día
  cuencas: z.number().optional(),

  // Puntos de medición — conteos por estado
  totalPuntos: z.number().optional(),
  operativos: z.number().optional(),
  incompletos: z.number().optional(),
  enAlerta: z.number().optional(),
  aResolver: z.number().optional(),
  enMantenimiento: z.number().optional(),
  sinDispositivo: z.number().optional(),
  sinReportar: z.number().optional(),
  dadosDeBaja: z.number().optional(),

  // Dispositivos tradicionales
  totalDispositivos: z.number().optional(),
  puntosConDispositivo: z.number().optional(),

  // SCADA
  totalDispositivosScada: z.number().optional(),
  puntosScadaConDispositivo: z.number().optional(),
});
export type IIndicadorHistorico = z.infer<typeof IndicadorHistoricoSchema>;

export const CreateIndicadorHistoricoSchema = IndicadorHistoricoSchema.omit({
  _id: true,
});
export type ICreateIndicadorHistorico = z.infer<typeof CreateIndicadorHistoricoSchema>;
