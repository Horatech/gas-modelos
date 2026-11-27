import { z } from "zod";
import {
  FiltrosExportPuntosMedicionSchema,
  type IFiltrosExportPuntosMedicion,
} from "../gas/exportacion";

/**
 * El pedido de una exportación que propone el asistente (herramienta `proponer_exportacion`). Es declarativo: el front
 * lo lanza con los endpoints de siempre recién cuando el usuario toca "Exportar". `registros` = el export de registros
 * de correctoras de la pantalla Exportar; `reportes` = el export por reportes de esa pantalla (Residencial, Presión…);
 * `padron` = el padrón de puntos e `indicadores` = los indicadores de unidades de negocio (los dos por `POST /exportaciones`).
 */

/** Las divisiones que exporta `POST /reportes/exportar/async` (gas-api-cliente, `prepararFiltroExportacion`). */
export const DIVISIONES_REPORTES = ["Residencial", "Presión", "Residencial Agua", "Dispositivo Externo NUC"] as const;

/** Los presets de columnas del catálogo del padrón (gas-datos, PRESETS_PUNTOS_MEDICION). */
export const PRESETS_PADRON = ["padron-minimo", "operaciones", "comercial", "ente", "todo"] as const;

export const MAX_PUNTOS_EXPORTACION = 200;
export const MAX_DIAS_EXPORTACION = 366;
const DIA_MS = 86_400_000;

const CLAVES_CONJUNTO = [
  "idGrupo",
  "idAgrupacion",
  "idCuenca",
  "idLocalidad",
  "idUnidadNegocio",
  "idCentroOperativo",
  "idsPunto",
] as const;

/** Exactamente uno: un conjunto (la API lo resuelve a sus puntos actuales) o una lista de puntos. */
export const ConjuntoExportacionSchema = z
  .object({
    idGrupo: z.string().min(1).optional(),
    idAgrupacion: z.string().min(1).optional(),
    idCuenca: z.string().min(1).optional(),
    idLocalidad: z.string().min(1).optional(),
    idUnidadNegocio: z.string().min(1).optional(),
    idCentroOperativo: z.string().min(1).optional(),
    idsPunto: z.array(z.string().min(1)).min(1).max(MAX_PUNTOS_EXPORTACION).optional(),
  })
  .refine((c) => CLAVES_CONJUNTO.filter((k) => c[k] !== undefined).length === 1, {
    message: "Un solo conjunto o una lista de puntos",
  });
export type IConjuntoExportacion = z.infer<typeof ConjuntoExportacionSchema>;

// Período de 1 a 366 días.
const periodoValido = (p: { desde: string; hasta: string }) => {
  const ms = Date.parse(p.hasta) - Date.parse(p.desde);
  return ms > 0 && ms <= MAX_DIAS_EXPORTACION * DIA_MS;
};

export const PedidoExportacionRegistrosSchema = z
  .object({
    export: z.literal("registros"),
    desde: z.iso.datetime(),
    hasta: z.iso.datetime(),
    agrupacionTemporal: z.enum(["hora", "dia", "mes"]),
    ordenCronologico: z.enum(["asc", "desc"]).optional(),
    conjunto: ConjuntoExportacionSchema,
  })
  .refine(periodoValido, { message: `El período va de 1 a ${MAX_DIAS_EXPORTACION} días` });

export const PedidoExportacionReportesSchema = z
  .object({
    export: z.literal("reportes"),
    division: z.enum(DIVISIONES_REPORTES),
    desde: z.iso.datetime(),
    hasta: z.iso.datetime(),
    agrupacionTemporal: z.enum(["hora", "dia", "mes"]),
    // La API de reportes no resuelve zonas de calidad.
    conjunto: ConjuntoExportacionSchema.refine((c) => c.idCuenca === undefined, {
      message: "Reportes no se exportan por zona de calidad",
    }),
  })
  .refine(periodoValido, { message: `El período va de 1 a ${MAX_DIAS_EXPORTACION} días` });

export const PedidoExportacionIndicadoresSchema = z.object({
  export: z.literal("indicadores"),
  filtros: FiltrosExportPuntosMedicionSchema,
});

export const PedidoExportacionPadronSchema = z.object({
  export: z.literal("padron"),
  filtros: FiltrosExportPuntosMedicionSchema,
  preset: z.enum(PRESETS_PADRON),
});

export const PedidoExportacionSchema = z.discriminatedUnion("export", [
  PedidoExportacionRegistrosSchema,
  PedidoExportacionReportesSchema,
  PedidoExportacionPadronSchema,
  PedidoExportacionIndicadoresSchema,
]);
export type IPedidoExportacion = z.infer<typeof PedidoExportacionSchema>;

// El día gas de un instante: corta a las 07:00 de Argentina (10:00Z), así que el día es el de (t − 10 h) en UTC.
function diaGas(iso: string): string {
  const d = new Date(Date.parse(iso) - 10 * 3_600_000);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getUTCFullYear()}`;
}

const AGRUPACION = { hora: "por hora", dia: "por día", mes: "por mes" } as const;

function filtrosEnPalabras(f: IFiltrosExportPuntosMedicion): string[] {
  return [...(f.divisiones ?? []), ...(f.estados ?? []), ...(f.tiposAlertaActivos ?? [])];
}

/** El texto de la tarjeta: lo que se confirma es lo que se lanza. `conjunto` = cómo lo nombró el usuario. */
export function describirExportacion(
  pedido: IPedidoExportacion,
  nombres: { conjunto?: string; cantidadPuntos: number },
): string {
  const n = nombres.cantidadPuntos;
  const puntos = `${n} ${n === 1 ? "punto" : "puntos"}`;
  if (pedido.export === "registros" || pedido.export === "reportes") {
    const que = pedido.export === "registros" ? "Registros de correctoras" : `Reportes de ${pedido.division}`;
    return (
      `${que} ${AGRUPACION[pedido.agrupacionTemporal]}, del ${diaGas(pedido.desde)} al ` +
      `${diaGas(pedido.hasta)} (días gas), de ${puntos}${nombres.conjunto ? `: ${nombres.conjunto}` : ""}`
    );
  }
  if (pedido.export === "indicadores") {
    const divisiones = pedido.filtros.divisiones?.length ? pedido.filtros.divisiones : ["todas las divisiones"];
    return [`Indicadores de unidades de negocio (${puntos})`, ...divisiones, ...(nombres.conjunto ? [nombres.conjunto] : [])].join(" · ");
  }
  return [`Padrón de ${puntos} (columnas: ${pedido.preset})`, ...filtrosEnPalabras(pedido.filtros)].join(" · ");
}
