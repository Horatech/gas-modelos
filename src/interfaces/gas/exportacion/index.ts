// Tipos del subsistema de exportación (jobs asíncronos + catálogo de columnas).
//
// IMPORTANTE: este paquete es SOLO TIPOS. No agregar `const`, `enum` ni
// funciones acá: emiten JavaScript y los servicios NestJS que importan un valor
// desde `modelos/src` rompen en runtime con MODULE_NOT_FOUND aunque lint y build
// pasen (ya tumbó gas-api-clima v1.1.2 y gas-api-cliente v3.7.4 en producción).
// El catálogo con sus valores vive en gas-datos.

import { z } from "zod";

export const TipoExportJobSchema = z.enum([
  "registros",
  "reporte",
  "medidor-electrico",
  "puntos-medicion",
]);
export type TipoExportJob = z.infer<typeof TipoExportJobSchema>;

export const EstadoExportJobSchema = z.enum([
  "pendiente",
  "procesando",
  "completado",
  "error",
]);
export type EstadoExportJob = z.infer<typeof EstadoExportJobSchema>;

export const FormatoExportSchema = z.enum(["xlsx", "csv"]);
export type FormatoExport = z.infer<typeof FormatoExportSchema>;

// Qué se escribe en el workbook. "indicadores" recorre el mismo universo pero
// no emite las hojas de detalle.
export const NivelDetalleExportSchema = z.enum([
  "indicadores",
  "detalle",
  "completo",
]);
export type NivelDetalleExport = z.infer<typeof NivelDetalleExportSchema>;

export const FormatoColumnaExportSchema = z.enum([
  "texto",
  "entero",
  "numero",
  "porcentaje",
  "fecha",
  "fechaHora",
  "booleano",
  "lista",
  "coordenada",
]);
export type FormatoColumnaExport = z.infer<typeof FormatoColumnaExportSchema>;

export const TipoWidgetFiltroSchema = z.enum([
  "texto",
  "booleano",
  "enum-multiple",
  "entidad-multiple",
  "rango-fechas",
]);
export type TipoWidgetFiltro = z.infer<typeof TipoWidgetFiltroSchema>;

// Colecciones que el front puede listar para poblar un filtro de entidad.
// No incluye cuentaClientes: no hay endpoint de listado para el usuario.
export const EntidadFiltroSchema = z.enum([
  "unidadNegocios",
  "centroOperativos",
  "localidads",
  "cuencas",
  "grupos",
  "agrupacions",
  "subzonasTarifarias",
]);
export type EntidadFiltro = z.infer<typeof EntidadFiltroSchema>;

export const ColumnaExportDescriptorSchema = z.object({
  // Contrato estable: no se renombra ni se reusa para otro dato.
  key: z.string(),
  // Presentación: es lo que sale como encabezado del Excel.
  label: z.string(),
  grupo: z.string(),
  formato: FormatoColumnaExportSchema,
  // Va en el encabezado, nunca pegada al valor de la celda.
  unidad: z.string().optional(),
  decimales: z.number().optional(),
  obligatoria: z.boolean().optional(),
  porDefecto: z.boolean().optional(),
  // PII: se filtra por rol en gas-api-cliente antes de encolar el job.
  sensible: z.boolean().optional(),
  // Divisiones donde la columna tiene sentido; vacío o ausente = todas.
  divisiones: z.array(z.string()).optional(),
  // Se sigue sirviendo para no romper a quien la pide, pero no se ofrece.
  deprecada: z.boolean().optional(),
  descripcion: z.string().optional(),
});
export type IColumnaExportDescriptor = z.infer<
  typeof ColumnaExportDescriptorSchema
>;

export const OpcionFiltroExportSchema = z.object({
  valor: z.string(),
  label: z.string(),
});
export type IOpcionFiltroExport = z.infer<typeof OpcionFiltroExportSchema>;

export const FiltroExportDescriptorSchema = z.object({
  key: z.string(),
  label: z.string(),
  widget: TipoWidgetFiltroSchema,
  entidad: EntidadFiltroSchema.optional(),
  opciones: z.array(OpcionFiltroExportSchema).optional(),
  ayuda: z.string().optional(),
});
export type IFiltroExportDescriptor = z.infer<
  typeof FiltroExportDescriptorSchema
>;

export const PresetColumnasExportSchema = z.object({
  key: z.string(),
  label: z.string(),
  columnas: z.array(z.string()),
});
export type IPresetColumnasExport = z.infer<typeof PresetColumnasExportSchema>;

export const CatalogoExportSchema = z.object({
  tipo: TipoExportJobSchema,
  version: z.number(),
  // Identifica el contenido del catálogo; sirve para invalidar cachés del front.
  hash: z.string(),
  columnas: z.array(ColumnaExportDescriptorSchema),
  filtros: z.array(FiltroExportDescriptorSchema),
  presets: z.array(PresetColumnasExportSchema),
});
export type ICatalogoExport = z.infer<typeof CatalogoExportSchema>;

export const FiltrosExportPuntosMedicionSchema = z.object({
  divisiones: z.array(z.string()).optional(),
  estados: z.array(z.string()).optional(),
  tiposAlertaActivos: z.array(z.string()).optional(),
  idsUnidadNegocio: z.array(z.string()).optional(),
  idsCentroOperativo: z.array(z.string()).optional(),
  idsLocalidad: z.array(z.string()).optional(),
  idsCuenca: z.array(z.string()).optional(),
  idsGrupo: z.array(z.string()).optional(),
  idsAgrupacion: z.array(z.string()).optional(),
  idsSubzonaTarifaria: z.array(z.string()).optional(),
  idsPuntoMedicion: z.array(z.string()).optional(),
  conDispositivo: z.boolean().optional(),
  facturable: z.boolean().optional(),
  // Por defecto los puntos "Dado de Baja" quedan fuera del padrón.
  incluirDadosDeBaja: z.boolean().optional(),
  sinReportarDesde: z.string().optional(),
  sinReportarHasta: z.string().optional(),
  busqueda: z.string().optional(),
});
export type IFiltrosExportPuntosMedicion = z.infer<
  typeof FiltrosExportPuntosMedicionSchema
>;

export const CrearExportRequestSchema = z.object({
  tipo: TipoExportJobSchema,
  formato: FormatoExportSchema.optional(),
  nombreArchivo: z.string().optional(),
  nivelDetalle: NivelDetalleExportSchema.optional(),
  // Keys del catálogo, EN EL ORDEN en que van las columnas del Excel.
  columnas: z.array(z.string()).optional(),
  // Hojas hijas de las relaciones N-a-N (SCADA, entradas digitales del NUC).
  incluirHojasHijas: z.boolean().optional(),
  filtros: FiltrosExportPuntosMedicionSchema.optional(),
});
export type ICrearExportRequest = z.infer<typeof CrearExportRequestSchema>;

export const CrearExportResponseSchema = z.object({
  jobId: z.string(),
  estado: EstadoExportJobSchema,
  filasEstimadas: z.number().optional(),
});
export type ICrearExportResponse = z.infer<typeof CrearExportResponseSchema>;

export const ExportJobSchema = z.object({
  _id: z.string().optional(),
  tipo: TipoExportJobSchema.optional(),
  estado: EstadoExportJobSchema.optional(),
  formato: FormatoExportSchema.optional(),
  progreso: z.number().optional(),
  fechaCreacion: z.string().optional(),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  nombreArchivo: z.string().optional(),
  urlDescarga: z.string().optional(),
  error: z.string().optional(),
  idCliente: z.string().optional(),
  idUsuario: z.string().optional(),
  username: z.string().optional(),
  // Texto legible del scope aplicado ("Localidades: 12 (Chascomús, …)"). El
  // filtro crudo no va al Excel: una celda tiene un tope de 32.767 caracteres.
  resumenScope: z.string().optional(),
  filas: z.number().optional(),
  cantidadPuntos: z.number().optional(),
  bytes: z.number().optional(),
  duracionMs: z.number().optional(),
  intentos: z.number().optional(),
  // Columnas que se pidieron pero se quitaron por permisos (PII).
  columnasOmitidas: z.array(z.string()).optional(),
});
export type IExportJob = z.infer<typeof ExportJobSchema>;
