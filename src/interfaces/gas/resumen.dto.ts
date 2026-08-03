import { z } from "zod";
import type { ICuenca } from "../entidades/cuenca";
import type { IMedidorResidencial } from "../entidades/medidor-residencial";
import type { IPuntoMedicion } from "../entidades/punto-medicion";
import type { ICliente } from "../tenant/cliente.model";
import { CentroOperativoSchema } from "./centroOperativo/schema";
import { UnidadNegocioSchema } from "./unidadNegocio/schema";

// Resumen
export const ResumenUnidadNegocioSchema = z.object({
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativos: z
    .array(
      z.object({
        cantReportesOkPunto: z.number().optional(),
        cantReportesOkMedidor: z.number().optional(),
        porcentajeReportePuntos: z.number().optional(),
        porcentajeReporteMedidores: z.number().optional(),
        centroOperativo: CentroOperativoSchema.optional(),
        puntos: z.array(z.custom<IPuntoMedicion>()).optional(),
        medidores: z.array(z.custom<IMedidorResidencial>()).optional(),
      }),
    )
    .optional(),
  cuencas: z
    .array(
      z.object({
        cantReportesOkPunto: z.number().optional(),
        cantReportesOkMedidor: z.number().optional(),
        porcentajeReportePuntos: z.number().optional(),
        porcentajeReporteMedidores: z.number().optional(),
        cuenca: z.custom<ICuenca>().optional(),
        puntos: z.array(z.custom<IPuntoMedicion>()).optional(),
        medidores: z.array(z.custom<IMedidorResidencial>()).optional(),
      }),
    )
    .optional(),
  cantidadCuencas: z.number().optional(),
  cantidadCentroOperativos: z.number().optional(),
  cantidadPuntos: z.number().optional(),
  cantidadPuntosEnMantenimiento: z.number().optional(),
  cantidadPuntosResolver: z.number().optional(),
  cantidadPuntosSinReportar: z.number().optional(),
  cantidadPuntosSinDispositivo: z.number().optional(),
  cantidadMedidores: z.number().optional(),
  cantReportesOkPunto: z.number().optional(),
  cantReportesOkMedidor: z.number().optional(),
  porcentajeReportePuntos: z.number().optional(),
  porcentajeReporteMedidores: z.number().optional(),
});
export type IResumenUnidadNegocio = z.infer<typeof ResumenUnidadNegocioSchema>;

export const ResumenClienteSchema = z.object({
  cliente: z.custom<ICliente>(),
  cantidadDispositivos: z.number(),
});
export type IResumenCliente = z.infer<typeof ResumenClienteSchema>;
