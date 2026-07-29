// Tipos del subsistema de exportación (jobs asíncronos + catálogo de columnas).
//
// IMPORTANTE: este paquete es SOLO TIPOS. No agregar `const`, `enum` ni
// funciones acá: emiten JavaScript y los servicios NestJS que importan un valor
// desde `modelos/src` rompen en runtime con MODULE_NOT_FOUND aunque lint y build
// pasen (ya tumbó gas-api-clima v1.1.2 y gas-api-cliente v3.7.4 en producción).
// El catálogo con sus valores vive en gas-datos.

export type TipoExportJob =
  | "registros"
  | "reporte"
  | "medidor-electrico"
  | "puntos-medicion";

export type EstadoExportJob =
  | "pendiente"
  | "procesando"
  | "completado"
  | "error";

export type FormatoExport = "xlsx" | "csv";

// Qué se escribe en el workbook. "indicadores" recorre el mismo universo pero
// no emite las hojas de detalle.
export type NivelDetalleExport = "indicadores" | "detalle" | "completo";

export type FormatoColumnaExport =
  | "texto"
  | "entero"
  | "numero"
  | "porcentaje"
  | "fecha"
  | "fechaHora"
  | "booleano"
  | "lista"
  | "coordenada";

export type TipoWidgetFiltro =
  | "texto"
  | "booleano"
  | "enum-multiple"
  | "entidad-multiple"
  | "rango-fechas";

// Colecciones que el front puede listar para poblar un filtro de entidad.
// No incluye cuentaClientes: no hay endpoint de listado para el usuario.
export type EntidadFiltro =
  | "unidadNegocios"
  | "centroOperativos"
  | "localidads"
  | "cuencas"
  | "grupos"
  | "agrupacions"
  | "subzonasTarifarias";

export interface IColumnaExportDescriptor {
  // Contrato estable: no se renombra ni se reusa para otro dato.
  key: string;
  // Presentación: es lo que sale como encabezado del Excel.
  label: string;
  grupo: string;
  formato: FormatoColumnaExport;
  // Va en el encabezado, nunca pegada al valor de la celda.
  unidad?: string;
  decimales?: number;
  obligatoria?: boolean;
  porDefecto?: boolean;
  // PII: se filtra por rol en gas-api-cliente antes de encolar el job.
  sensible?: boolean;
  // Divisiones donde la columna tiene sentido; vacío o ausente = todas.
  divisiones?: string[];
  // Se sigue sirviendo para no romper a quien la pide, pero no se ofrece.
  deprecada?: boolean;
  descripcion?: string;
}

export interface IOpcionFiltroExport {
  valor: string;
  label: string;
}

export interface IFiltroExportDescriptor {
  key: string;
  label: string;
  widget: TipoWidgetFiltro;
  entidad?: EntidadFiltro;
  opciones?: IOpcionFiltroExport[];
  ayuda?: string;
}

export interface IPresetColumnasExport {
  key: string;
  label: string;
  columnas: string[];
}

export interface ICatalogoExport {
  tipo: TipoExportJob;
  version: number;
  // Identifica el contenido del catálogo; sirve para invalidar cachés del front.
  hash: string;
  columnas: IColumnaExportDescriptor[];
  filtros: IFiltroExportDescriptor[];
  presets: IPresetColumnasExport[];
}

export interface IFiltrosExportPuntosMedicion {
  divisiones?: string[];
  estados?: string[];
  tiposAlertaActivos?: string[];
  idsUnidadNegocio?: string[];
  idsCentroOperativo?: string[];
  idsLocalidad?: string[];
  idsCuenca?: string[];
  idsGrupo?: string[];
  idsAgrupacion?: string[];
  idsSubzonaTarifaria?: string[];
  idsPuntoMedicion?: string[];
  conDispositivo?: boolean;
  facturable?: boolean;
  // Por defecto los puntos "Dado de Baja" quedan fuera del padrón.
  incluirDadosDeBaja?: boolean;
  sinReportarDesde?: string;
  sinReportarHasta?: string;
  busqueda?: string;
}

export interface ICrearExportRequest {
  tipo: TipoExportJob;
  formato?: FormatoExport;
  nombreArchivo?: string;
  nivelDetalle?: NivelDetalleExport;
  // Keys del catálogo, EN EL ORDEN en que van las columnas del Excel.
  columnas?: string[];
  // Hojas hijas de las relaciones N-a-N (SCADA, entradas digitales del NUC).
  incluirHojasHijas?: boolean;
  filtros?: IFiltrosExportPuntosMedicion;
}

export interface ICrearExportResponse {
  jobId: string;
  estado: EstadoExportJob;
  filasEstimadas?: number;
}

export interface IExportJob {
  _id?: string;
  tipo?: TipoExportJob;
  estado?: EstadoExportJob;
  formato?: FormatoExport;
  progreso?: number;
  fechaCreacion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  nombreArchivo?: string;
  urlDescarga?: string;
  error?: string;
  idCliente?: string;
  idUsuario?: string;
  username?: string;
  // Texto legible del scope aplicado ("Localidades: 12 (Chascomús, …)"). El
  // filtro crudo no va al Excel: una celda tiene un tope de 32.767 caracteres.
  resumenScope?: string;
  filas?: number;
  cantidadPuntos?: number;
  bytes?: number;
  duracionMs?: number;
  intentos?: number;
  // Columnas que se pidieron pero se quitaron por permisos (PII).
  columnasOmitidas?: string[];
}
