/**
 * Descriptor semántico de canal de medición.
 *
 * Un **canal** es un slot con nombre dentro de una familia de documentos de
 * lectura. Un `IRegistro` de correctora son 11 canales (presión, temperatura,
 * volumen corregido y sin corregir, caudal, fpv, batería…); un
 * `IRegistroMedidorElectrico` son 42. El descriptor dice **qué significa** cada
 * uno, para que las vistas y los cálculos dejen de decidirlo por su cuenta.
 *
 * Plan: `/PLAN-MODELO-CANONICO-MULTIVERTICAL.md` (F1) · especificación del
 * descriptor: `/PLAN-CAPA-SEMANTICA-CANALES.md` §5 · revisión multi-vertical:
 * `/ANALISIS-MODELO-MULTIVERTICAL.md`.
 *
 * ## Por qué esto NO son schemas Zod
 *
 * El descriptor **no se persiste**: es catálogo, no entidad. No entra ni sale de
 * la DB, no viaja en un body que haya que validar. Un `z.object` acá no aportaría
 * validación de nada y arrastraría dependencias de schema sin motivo. Mismo
 * criterio que `METADATA_ENTIDADES_VINCULABLES` en `vinculacion.ts`: data pura,
 * segura de exportar como valor runtime.
 *
 * `IClasificacionPunto` e `IZonaBalance` **sí** son Zod, porque sí se persisten.
 *
 * ## Retrocompatibilidad
 *
 * Este archivo es 100% aditivo: define tipos y funciones nuevas que **nadie
 * consume todavía**. Publicarlo no cambia el comportamiento de ningún servicio.
 * El día que un consumidor use el resolver, lo hace detrás de su propio gate.
 */

import type { Division } from "../tenant/usuario/permiso";
import type { Commodity } from "./commodity";

export type { Commodity };

/**
 * Qué clase de cosa mide el canal.
 * - `proceso`: magnitud de la vertical. Entra a la analítica de commodity.
 * - `dispositivo`: salud del EQUIPO (batería, señal, contadores de fallas).
 *   **Nunca** entra a un rollup de vertical.
 * - `ambiente`: entorno físico (temperatura ambiente). Correlaciona con clima,
 *   no es consumo.
 */
export type Dominio = "proceso" | "dispositivo" | "ambiente";

/**
 * Magnitud física. Dos canales sólo son comparables si coinciden en esto.
 *
 * Deliberadamente NO incluye `bateria`, `senal` ni `estado`: eso es `dominio` +
 * `rol`, no una magnitud. La batería es `tension` con `dominio: 'dispositivo'`.
 */
export type QuantityKind =
  | "volumen"
  | "caudal"
  | "presion"
  | "temperatura"
  | "energia"
  | "potencia"
  | "tension"
  | "corriente"
  | "nivel"
  | "concentracion"
  | "compresibilidad"
  | "porcentaje"
  | "conteo"
  | "tiempo"
  | "na";

/**
 * Cómo se relaciona el valor con el tiempo. Es el discriminante duro de
 * sumable-vs-no (CIM `ReadingType.accumulation`).
 *
 * - `cumulative`: odómetro. Se agrega con `last`, **jamás** con `sum`.
 * - `delta`: consumo del período. Se agrega con `sum`.
 * - `instantaneous`: valor puntual. Se agrega con promedio/mín/máx.
 * - `extremoIntervalo`: **el extremo alcanzado DENTRO del intervalo**, no un
 *   valor puntual ni un acumulado. Se agrega con `max` (o `min`), nunca con
 *   `sum`. Es el caso de la demanda máxima del medidor eléctrico —
 *   `demandaMaxImportadaW`, `demandaMaxExportadaT2W` —. Este valor no existía en
 *   el plan original; se agregó en la revisión multi-vertical.
 * - `none`: no aplica (flags, textos).
 */
export type Accumulation =
  | "cumulative"
  | "delta"
  | "instantaneous"
  | "extremoIntervalo"
  | "none";

/** Tipo del valor observado (OGC O&M `observationType`). */
export type TipoValor = "numerico" | "booleano" | "enum" | "texto";

/**
 * Para qué está el canal (eje de Project Haystack). Distingue una medida de un
 * setpoint, de un comando y de un dato de diagnóstico — que CIM no expresa.
 */
export type RolCanal =
  | "medida"
  | "setpoint"
  | "comando"
  | "alarma"
  | "estado"
  | "diagnostico";

/**
 * En qué condiciones está expresado el valor. **Requisito de conservación en
 * gas**: lo que se conserva es masa, y sin corregir por presión, temperatura y
 * compresibilidad no se conserva nada.
 *
 * OJO — "corregido" tiene dos significados incompatibles en el sistema:
 * `IReporteSML.consumoCorregido` es el acumulado ± un offset **administrativo**
 * cargado en la plataforma (`condicionMedicion: 'medida'`), mientras
 * `IRegistro.correctedParcializado` es Vb con corrección **metrológica** PTZ
 * (`condicionMedicion: 'corregidaPTZ'`). No son sumables entre sí.
 */
export type CondicionMedicion = "medida" | "base" | "corregidaPTZ" | "na";

/** De dónde sale el número. Evita mezclar pronóstico con observación. */
export type Naturaleza =
  | "medido"
  | "calculado"
  | "estimado"
  | "pronosticado"
  | "declarado";

/**
 * Sentido del flujo. **Es parte de la IDENTIDAD del canal, no un atributo.**
 *
 * `whImportada` y `whExportada` son DOS canales, no uno con signo: tienen todos
 * los demás ejes idénticos y sin embargo **no son neteables**. 100 kWh netos
 * pueden venir de 100 importados o de 600 importados y 500 exportados, y el
 * operador necesita distinguirlos: cuánto se **inyectó** es el dato que determina
 * el alivio de carga del transformador de la zona y si se cruzó el umbral por
 * encima del cual el flujo se invierte. Netear lo destruye.
 *
 * (La plataforma **no** hace facturación ni valorización, así que el motivo no es
 * el precio: es operativo.)
 *
 * `neto` describe un canal que YA viene neteado por el productor (p. ej.
 * `IReporteSML.consumo`, neto de flujo inverso). Se declara para poder marcarlo
 * y no volver a netearlo, no porque sea deseable.
 */
export type FlowDirection = "entrante" | "saliente" | "neto" | "na";

/**
 * Ventana sobre la que está definido el valor (CIM `measuringPeriod`).
 *
 * Sin esto, en electricidad la energía de la hora, el máximo dentro de la hora y
 * un valor instantáneo son indistinguibles: mismo `quantityKind`, misma unidad.
 *
 * `periodoReporte` = la ventana la fija la configuración del equipo (el período
 * de reporte de la correctora), no es fija en el catálogo.
 */
export type MeasuringPeriod =
  | "instantaneo"
  | "periodoReporte"
  | "horario"
  | "diario"
  | "mensual"
  | "na";

/**
 * Banda horaria (CIM `tou`). En electricidad las 18 métricas del protocolo son
 * 6 bases × 3 bandas.
 *
 * Sirve para **perfilar la demanda por franja horaria**, que es un uso operativo.
 * Las bandas suman al total (T1+T2+T3 = total), así que mezclar una banda con el
 * total es doble conteo — eso lo cubre `particion`.
 */
export type Tou = "total" | "T1" | "T2" | "T3" | "na";

/** Referencia de la presión. Un tag reportando −1,01325 bar es un 0 absoluto. */
export type ReferenciaPresion = "manometrica" | "absoluta" | "desconocida";

/** Estado de despliegue del productor del canal. */
export type EstadoCanal = "prod" | "test";

/** Cómo se obtiene el valor. */
export type OrigenValor =
  | "medido-por-equipo"
  | "copiado-de-config"
  | "calculado-en-backend"
  | "desconocido";

/**
 * Rango físicamente plausible. Fuera de rango ⇒ el valor se descarta como
 * `valorAusente`, no se agrega.
 */
export interface IRangoPlausible {
  min?: number;
  max?: number;
}

/**
 * Resolución de la unidad cuando NO es fija en el catálogo, sino que viaja en el
 * propio documento.
 *
 * Caso real: `IReporteNSP.unidad` es un código de presión entre seis
 * (`KPA/MPA/BAR/KGCM2/PSI/MMH20`). Y `IReporteSML.unidad` es **otra cosa**: un
 * código numérico de escala de caudal del medidor. Mismo nombre de campo, otro
 * tipo, otro significado — por eso el perfil es parte de la clave del canal.
 */
export interface IUnidadResolver {
  scope: "reporte" | "entidad";
  /** Path del campo dentro del documento (o de la entidad) que trae la unidad. */
  campoUnidad: string;
}

/**
 * Relación parte / total. Sin esto se doble-cuenta en silencio.
 *
 * Casos: `whImportadaT1` es parte de `whImportada`; `consumoPositivo` y
 * `consumoNegativo` son partes de `consumo`; Vm y Vb describen **el mismo gas**
 * en condiciones distintas.
 */
export interface IParticion {
  /** `CanalRef` del canal total del que este canal es una parte. */
  esParteDe: string;
  /**
   * `true` si las partes suman exactamente el total (bandas horarias).
   * `false` si son vistas alternativas del mismo hecho y **no** se suman entre
   * sí (Vm vs Vb).
   */
  sumanAlTotal: boolean;
}

/**
 * Descriptor de un canal. Todo opcional salvo los cuatro ejes que definen la
 * comparabilidad, porque un descriptor sin ellos no sirve para nada.
 */
export interface ICanalDescriptor {
  // ── Identidad semántica ────────────────────────────────────────────────
  dominio: Dominio;
  commodity: Commodity;
  quantityKind: QuantityKind;
  accumulation: Accumulation;
  /**
   * Unidad canónica como código UCUM (`m3`, `bar`, `Cel`, `W.h`, `var.h`,
   * `m3/h`, `V`, `A`, `%`).
   *
   * **Es metadato, JAMÁS un factor de escala.** Los equipos ya persisten el
   * valor escalado; convertir acá sería convertir dos veces.
   */
  unidadCanonica: string;
  unidadResolver?: IUnidadResolver;

  // ── Ejes que completan la identidad ────────────────────────────────────
  /** Parte de la identidad: dos sentidos son dos canales. */
  flowDirection: FlowDirection;
  /** Parte de la identidad: la hora y el máximo de la hora no son lo mismo. */
  measuringPeriod: MeasuringPeriod;
  /** Parte de la identidad para lo económico; agregable para lo físico. */
  tou: Tou;
  condicionMedicion: CondicionMedicion;

  // ── Cómo se lee y cómo se agrega ───────────────────────────────────────
  tipoValor: TipoValor;
  rol: RolCanal;
  naturaleza: Naturaleza;
  particion?: IParticion;
  /**
   * `false` prohíbe agregar este canal ENTRE dispositivos distintos hasta que
   * los puntos declaren su rol de red. Ver `agregable()`.
   */
  agregableEntreDispositivos: boolean;
  referencia?: ReferenciaPresion;
  /** Valores que significan "sin dato" y hay que filtrar ANTES de agregar. */
  valorAusente?: number[];
  rangoPlausible?: IRangoPlausible;

  // ── Calidad, autorización, ciclo de vida ───────────────────────────────
  /**
   * `false` = el canal existe en el payload pero **no se publica**: no entra a
   * vistas ni a cálculos. Es el default seguro para lo que no se entendió.
   */
  emitido: boolean;
  origen?: OrigenValor;
  /** División requerida para ver este canal. Sin esto, el resumen multi-vertical filtraría de menos. */
  divisionRequerida?: Division;
  estado: EstadoCanal;
  /** `CanalRef` del canal canónico, cuando este es un alias (kWh vs Wh). */
  aliasDe?: string;
  descripcion?: string;
}

/** Cómo agregar un canal, derivado de `accumulation` + `tipoValor`. */
export type Agg =
  | "sum"
  | "last"
  | "avgMinMax"
  | "max"
  | "min"
  | "countDuration"
  | "ninguna";

/**
 * Regla de agregación. **Siempre después** de filtrar `valorAusente` y
 * `emitido: false`.
 */
export function aggDe(d: ICanalDescriptor): Agg {
  if (d.tipoValor === "booleano" || d.tipoValor === "enum") {
    return "countDuration"; // nunca sum
  }
  if (d.rol === "setpoint" || d.rol === "comando") return "last";
  switch (d.accumulation) {
    case "delta":
      return "sum";
    case "cumulative":
      return "last"; // odómetro
    case "instantaneous":
      return "avgMinMax";
    case "extremoIntervalo":
      return "max";
    case "none":
      return "ninguna";
  }
}

/**
 * ¿Son físicamente sumables dos canales?
 *
 * **No alcanza para autorizar la suma**: falta la mitad del punto de medición.
 * Ver `agregable()`.
 */
export function sumable(a: ICanalDescriptor, b: ICanalDescriptor): boolean {
  if (!a.emitido || !b.emitido) return false;
  if (a.dominio !== b.dominio) return false;
  if (a.commodity !== b.commodity) return false;
  if (a.quantityKind !== b.quantityKind) return false;
  if (a.unidadCanonica !== b.unidadCanonica) return false;
  if (a.condicionMedicion !== b.condicionMedicion) return false;
  if (a.accumulation !== b.accumulation) return false;
  if (a.measuringPeriod !== b.measuringPeriod) return false;
  // Un odómetro no se suma ni consigo mismo.
  if (a.accumulation === "cumulative" || a.accumulation === "extremoIntervalo") {
    return false;
  }
  // Una parte no se suma con su total: sería doble conteo.
  if (a.particion?.esParteDe && b.particion?.esParteDe === undefined) {
    return false;
  }
  if (b.particion?.esParteDe && a.particion?.esParteDe === undefined) {
    return false;
  }
  return true;
}

/**
 * ¿Se pueden **netear** (restar uno del otro) dos canales?
 *
 * Estrictamente más fuerte que `sumable`: dos canales pueden ser físicamente
 * sumables y no-neteables. **Sentidos opuestos o bandas distintas nunca se
 * netean**, sin excepción declarable.
 *
 * El caso que lo motiva: `whImportada` y `whExportada` tienen todos los demás
 * ejes idénticos, así que `sumable` los acepta —sumarlas da "energía que cruzó el
 * medidor", que es una magnitud real— pero **restarlas borra cuánto se inyectó**,
 * que es el dato con el que se evalúa la carga del transformador de la zona.
 *
 * El neto se puede seguir calculando: lo que esta función impide es hacerlo **sin
 * conservar los dos sentidos por separado**.
 */
export function neteable(a: ICanalDescriptor, b: ICanalDescriptor): boolean {
  if (!sumable(a, b)) return false;
  if (a.flowDirection !== b.flowDirection) return false;
  if (a.tou !== b.tou) return false;
  return true;
}
