/**
 * Perfiles de lectura y `CanalRef`: el enlace programático entre un valor
 * reportado y su descriptor.
 *
 * Plan: `/PLAN-MODELO-CANONICO-MULTIVERTICAL.md` (F1) · diseño del enlace:
 * `/PLAN-CAPA-SEMANTICA-CANALES.md` §5.7.
 *
 * ## El problema que resuelve
 *
 * Un mismo documento trae muchos canales: un `IRegistro` de correctora son 11, un
 * `IRegistroMedidorElectrico` son 42. La firma `(tipoDispositivo, campo)` **no
 * alcanza** como clave, por cinco motivos verificados en el sistema:
 *
 * 1. La unidad viaja en el propio documento: `IReporteNSP.unidad` es un código de
 *    presión entre seis (`KPA/MPA/BAR/KGCM2/PSI/MMH20`).
 * 2. Mismo nombre de campo, otro tipo y otro significado: `unidad` es `string`
 *    (código de presión) en NSP y `number` (código de escala de caudal del
 *    medidor) en SML.
 * 3. La marca cambia la escala: la batería de correctora es passthrough crudo de 2
 *    bytes en todas las marcas y **float** en American Meter, y la API hace
 *    `parseInt(hex, 16)` igual para todas.
 * 4. SCADA se resuelve por instancia: `IScada.booleano` + `booleanoValorAlarma`
 *    definen **por tag** cuál valor es alarma.
 * 5. Alias en el mismo documento: `whImportada` y `kwhImportada` conviven —
 *    elegir mal es un factor 1000.
 *
 * ## Dos formas de documento
 *
 * - **Ancho** (N canales por documento): `registros` de correctora,
 *   `reportes.valores` de NSP/SML/EUW300/WRC/BOVE, `registrohorarioaguas`,
 *   `registromedidorelectricos`. La identidad del canal es el **nombre del campo**.
 * - **Angosto** (1 canal por documento): SCADA. `IReporteScada.valorActual` **no
 *   identifica nada** — el mismo nombre lleva presión en bar, presión en mbar,
 *   temperatura, porcentaje, concentración de odorante o un booleano. La identidad
 *   es el **tag** (`IDeviceInfo.tag`, "Solo SCADA") y el descriptor se arma desde
 *   la instancia de `IScada`.
 *
 * ## Alcance de este incremento (slice deliberado)
 *
 * El catálogo de abajo cubre **NUC (correctora) y NME (medidor eléctrico)** y nada
 * más. Son las dos familias que hacen falta para fijar en tests los seis errores
 * que este trabajo existe para impedir, y las dos que cubren las dos verticales
 * con productor en producción. El resto de las 15 familias se suma perfil por
 * perfil, sin tocar nada de lo ya publicado.
 *
 * El primer consumidor es el gráfico personalizado (P56 § 6): `CANALES_GRAFICABLES` y
 * `perfilDe` resuelven qué se grafica de cada punto que no es SCADA.
 */

import type { ICanalDescriptor } from "./canal-descriptor";
import type { TipoDispositivoGas } from "../auxiliares/tipoDispositivo";
import type { ModeloCorrectora } from "./mensajes-nuc/mensajes-nuc";
import type { Division } from "../tenant/usuario/permiso";
import type { VersionHardware } from "./firmware";

/** Colección de lecturas. Son cinco paralelas, no un único bag `valores.*`. */
export type OrigenLectura =
  | "registros"
  | "reportes"
  | "registrohorarioaguas"
  | "registromedidorelectricos"
  | "registroclimas";

export type FormaDocumento = "ancho" | "angosto";

/**
 * Cómo se reconoce un documento de este perfil. **No se puede indexar sólo por
 * `tipoDispositivo`**: `NUC`-correctora y `NUC-2`/InputsNuc comparten
 * `tipoDispositivo: 'NUC'`. Un NUC v2.0 puede reportar las dos cosas (según
 * `deviceMode`), así que se distinguen por `origen`, no por `versionHardware`.
 */
export interface IDiscriminantePerfil {
  deviceTipo?: TipoDispositivoGas;
  /** NUC: sólo el hardware v2.0 tiene I/O digital (InputsNuc / GPIO). */
  versionHardware?: VersionHardware;
  /** La marca de correctora cambia la escala de varios canales. */
  modelo?: ModeloCorrectora;
  /** `IReporteSML.tipo`: 'SindCon' | 'Hac' — mismo device, decode distinto. */
  valoresTipo?: string;
}

/** Perfil de forma angosta: la identidad del canal está en la instancia. */
export interface ICanalUnico {
  /** Path del valor dentro del documento. */
  campoValor: string;
  identidad: "device.tag" | "idScada";
  /** El descriptor se arma desde `IScada` (tipo, unidad, booleano*). */
  descriptorDesdeInstancia: true;
}

export interface IPerfilLectura {
  /** Clave del perfil dentro del origen. Es el segmento `<perfil>` del `CanalRef`. */
  clave: string;
  origen: OrigenLectura;
  discriminante: IDiscriminantePerfil;
  forma: FormaDocumento;
  /** Forma `ancho`: mapa campo → descriptor. */
  campos?: Record<string, ICanalDescriptor>;
  /** Forma `angosto`: cómo resolver el canal único. */
  canalUnico?: ICanalUnico;
  descripcion?: string;
}

/**
 * Clave estable de un canal: `<origen>/<perfil>#<selector>`.
 *
 * Es lo único que se pasa entre servicios y lo único que se persiste en configs,
 * vistas personalizadas y mapeos de integración. Ejemplos:
 *
 *     registros/NUC#presion
 *     registros/NUC:Corus#bateria
 *     reportes/SML:Hac#valores.consumoParcial
 *     reportes/SCADA#tag:AND_ESQ_ERP_BOLSON_UC_PE
 *     registromedidorelectricos/NME#whImportada
 */
export function canalRef(
  origen: OrigenLectura,
  perfil: string,
  selector: string,
): string {
  return `${origen}/${perfil}#${selector}`;
}

export interface ICanalRefPartes {
  origen: OrigenLectura;
  perfil: string;
  selector: string;
}

/** Inverso de `canalRef`. Devuelve `null` si la cadena no tiene el formato. */
export function parseCanalRef(ref: string): ICanalRefPartes | null {
  const hash = ref.indexOf("#");
  const slash = ref.indexOf("/");
  if (slash <= 0 || hash <= slash + 1 || hash === ref.length - 1) return null;
  return {
    origen: ref.slice(0, slash) as OrigenLectura,
    perfil: ref.slice(slash + 1, hash),
    selector: ref.slice(hash + 1),
  };
}

// ───────────────────────────────────────────────────────────────────────────
// Catálogo — slice NUC + NME
// ───────────────────────────────────────────────────────────────────────────

/**
 * Correctora de gas por NUC. Colección `registros`, forma ancha.
 *
 * Once canales en un documento, tres dominios y cuatro formas de agregación
 * distintas. `bateria` y `bateriaNUC` son `dominio: 'dispositivo'` y por lo tanto
 * **nunca** entran a un rollup de vertical.
 *
 * `bateria` queda con `emitido: false` a propósito: es passthrough crudo de 2
 * bytes, la escala depende de la marca (float en American Meter) y la API hace
 * `parseInt(hex, 16)` igual para todas. Hasta tener la tabla marca × escala, no se
 * publica.
 */
const PERFIL_NUC_CORRECTORA: IPerfilLectura = {
  clave: "NUC",
  origen: "registros",
  discriminante: { deviceTipo: "NUC" },
  forma: "ancho",
  descripcion: "Correctora de gas vía NUC (colección registros)",
  campos: {
    presion: {
      dominio: "proceso",
      commodity: "gas",
      quantityKind: "presion",
      accumulation: "instantaneous",
      unidadCanonica: "bar",
      flowDirection: "na",
      measuringPeriod: "periodoReporte",
      tou: "na",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "medido",
      // No se promedia presión entre equipos hasta que el punto declare su nivel
      // de red: en un mismo cliente conviven umbrales de 4,4 bar y de 70 bar.
      agregableEntreDispositivos: false,
      referencia: "manometrica",
      rangoPlausible: { min: 0, max: 100 },
      emitido: true,
      origen: "medido-por-equipo",
      divisionRequerida: "Correctoras",
      estado: "prod",
    },
    temperatura: {
      dominio: "proceso",
      commodity: "gas",
      quantityKind: "temperatura",
      accumulation: "instantaneous",
      unidadCanonica: "Cel",
      flowDirection: "na",
      measuringPeriod: "periodoReporte",
      tou: "na",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "medido",
      agregableEntreDispositivos: false,
      rangoPlausible: { min: -40, max: 80 },
      emitido: true,
      origen: "medido-por-equipo",
      divisionRequerida: "Correctoras",
      estado: "prod",
    },
    correctedParcializado: {
      dominio: "proceso",
      commodity: "gas",
      quantityKind: "volumen",
      accumulation: "delta",
      unidadCanonica: "m3",
      flowDirection: "entrante",
      measuringPeriod: "periodoReporte",
      tou: "na",
      // Vb: corrección metrológica por presión, temperatura y compresibilidad.
      condicionMedicion: "corregidaPTZ",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "medido",
      // Se levanta cuando el punto declara su rol de red (F3).
      agregableEntreDispositivos: false,
      emitido: true,
      origen: "medido-por-equipo",
      divisionRequerida: "Correctoras",
      estado: "prod",
      descripcion: "Volumen corregido del período (Vb)",
    },
    uncorrectedParcializado: {
      dominio: "proceso",
      commodity: "gas",
      quantityKind: "volumen",
      accumulation: "delta",
      unidadCanonica: "m3",
      flowDirection: "entrante",
      measuringPeriod: "periodoReporte",
      tou: "na",
      // Vm: NO es sumable con Vb, aunque comparta magnitud y unidad.
      condicionMedicion: "medida",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "medido",
      agregableEntreDispositivos: false,
      emitido: true,
      origen: "medido-por-equipo",
      divisionRequerida: "Correctoras",
      estado: "prod",
      descripcion: "Volumen sin corregir del período (Vm)",
    },
    correctedTotalizado: {
      dominio: "proceso",
      commodity: "gas",
      quantityKind: "volumen",
      accumulation: "cumulative",
      unidadCanonica: "m3",
      flowDirection: "entrante",
      measuringPeriod: "na",
      tou: "na",
      condicionMedicion: "corregidaPTZ",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "medido",
      agregableEntreDispositivos: false,
      emitido: true,
      origen: "medido-por-equipo",
      divisionRequerida: "Correctoras",
      estado: "prod",
      descripcion: "Odómetro de volumen corregido. Se agrega con last, nunca sum",
    },
    caudalPromedio: {
      dominio: "proceso",
      commodity: "gas",
      quantityKind: "caudal",
      accumulation: "instantaneous",
      unidadCanonica: "m3/h",
      flowDirection: "entrante",
      measuringPeriod: "periodoReporte",
      tou: "na",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "medido",
      agregableEntreDispositivos: false,
      emitido: true,
      origen: "medido-por-equipo",
      // Caudal entrante: un valor negativo es un centinela, no una medición.
      rangoPlausible: { min: 0 },
      divisionRequerida: "Correctoras",
      estado: "prod",
    },
    fpv: {
      dominio: "proceso",
      commodity: "gas",
      quantityKind: "compresibilidad",
      accumulation: "instantaneous",
      unidadCanonica: "1",
      flowDirection: "na",
      measuringPeriod: "periodoReporte",
      tou: "na",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "diagnostico",
      naturaleza: "medido",
      agregableEntreDispositivos: false,
      emitido: true,
      origen: "medido-por-equipo",
      divisionRequerida: "Correctoras",
      estado: "prod",
      descripcion: "Factor de compresibilidad. Sólo firmware >= v37",
    },
    bateria: {
      dominio: "dispositivo",
      commodity: "na",
      quantityKind: "tension",
      accumulation: "instantaneous",
      // Sin unidad: la escala depende de la marca y todavía no está tabulada.
      unidadCanonica: "na",
      flowDirection: "na",
      measuringPeriod: "periodoReporte",
      tou: "na",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "diagnostico",
      naturaleza: "medido",
      agregableEntreDispositivos: false,
      emitido: false,
      origen: "desconocido",
      estado: "prod",
      descripcion:
        "Passthrough crudo de 2 bytes; float en American Meter. No se publica hasta tener la tabla marca x escala",
    },
    bateriaNUC: {
      dominio: "dispositivo",
      commodity: "na",
      quantityKind: "tension",
      accumulation: "instantaneous",
      unidadCanonica: "V",
      flowDirection: "na",
      measuringPeriod: "periodoReporte",
      tou: "na",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "diagnostico",
      naturaleza: "medido",
      agregableEntreDispositivos: false,
      emitido: true,
      // El NUC copia el valor de su config al reporte: no es una medición fresca.
      origen: "copiado-de-config",
      estado: "prod",
    },
    horaTruncada: {
      dominio: "dispositivo",
      commodity: "na",
      quantityKind: "na",
      accumulation: "none",
      unidadCanonica: "na",
      flowDirection: "na",
      measuringPeriod: "na",
      tou: "na",
      condicionMedicion: "na",
      tipoValor: "booleano",
      rol: "estado",
      naturaleza: "calculado",
      agregableEntreDispositivos: false,
      emitido: true,
      estado: "prod",
    },
  },
};

/**
 * Medidor eléctrico NME. Colección `registromedidorelectricos`, forma ancha.
 *
 * 42 campos numéricos estructurados como `dirección × banda × magnitud`, con OBIS
 * citado en el schema. Este slice declara los ocho que el firmware conocido
 * reporta.
 *
 * Los tres puntos que hacen falta acá y en ningún otro perfil:
 * - `whImportada` y `whExportada` **no son neteables**: mismo todo, distinto
 *   sentido. Sumarlas es legítimo (energía que cruzó el medidor); restarlas borra
 *   cuánto se inyectó, que es el dato operativo.
 * - `demandaMax*W` es `extremoIntervalo`: se agrega con `max`, nunca con `sum`.
 *   Es el pico de carga del intervalo, y contra el límite del activo es lo que
 *   define si hay margen.
 * - `kwh*` son alias de `wh*`: elegir mal es un factor 1000.
 */
const PERFIL_NME: IPerfilLectura = {
  clave: "NME",
  origen: "registromedidorelectricos",
  discriminante: { deviceTipo: "NME" },
  forma: "ancho",
  descripcion: "Medidor eléctrico NME (registro horario)",
  campos: {
    whImportada: {
      dominio: "proceso",
      commodity: "electricidad",
      quantityKind: "energia",
      accumulation: "delta",
      unidadCanonica: "W.h",
      flowDirection: "entrante",
      measuringPeriod: "horario",
      tou: "total",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "calculado",
      agregableEntreDispositivos: false,
      emitido: true,
      origen: "calculado-en-backend",
      divisionRequerida: "Medidores Eléctricos",
      estado: "prod",
      descripcion: "OBIS 1.8.0 — delta de la hora",
    },
    whExportada: {
      dominio: "proceso",
      commodity: "electricidad",
      quantityKind: "energia",
      accumulation: "delta",
      unidadCanonica: "W.h",
      // Mismo todo que la importada salvo esto: por eso son dos canales.
      flowDirection: "saliente",
      measuringPeriod: "horario",
      tou: "total",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "calculado",
      agregableEntreDispositivos: false,
      emitido: true,
      origen: "calculado-en-backend",
      divisionRequerida: "Medidores Eléctricos",
      estado: "prod",
      descripcion:
        "OBIS 2.8.0 — inyección del usuario-generador. NO netear con la importada: cuánto se inyectó determina el alivio de carga del transformador de la zona",
    },
    whImportadaAcum: {
      dominio: "proceso",
      commodity: "electricidad",
      quantityKind: "energia",
      accumulation: "cumulative",
      unidadCanonica: "W.h",
      flowDirection: "entrante",
      measuringPeriod: "na",
      tou: "total",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "medido",
      agregableEntreDispositivos: false,
      // -1 = REGISTRO_AUSENTE: el equipo NO tiene el registro (0xFFFFFFFF) y no
      // se puede recuperar. Filtrar ANTES de cualquier suma.
      valorAusente: [-1],
      emitido: true,
      origen: "medido-por-equipo",
      divisionRequerida: "Medidores Eléctricos",
      estado: "prod",
    },
    kwhImportada: {
      dominio: "proceso",
      commodity: "electricidad",
      quantityKind: "energia",
      accumulation: "delta",
      unidadCanonica: "kW.h",
      flowDirection: "entrante",
      measuringPeriod: "horario",
      tou: "total",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "calculado",
      agregableEntreDispositivos: false,
      emitido: true,
      origen: "calculado-en-backend",
      divisionRequerida: "Medidores Eléctricos",
      estado: "prod",
      aliasDe: "registromedidorelectricos/NME#whImportada",
      descripcion: "Alias en kWh del canal canónico en Wh. Factor 1000",
    },
    varhImportada: {
      dominio: "proceso",
      commodity: "electricidad",
      quantityKind: "energia",
      // Reactiva: NO se suma con activa ni comparte su ecuación de conservación.
      // Se distingue por unidad, que es lo que hace `sumable` devolver false.
      accumulation: "delta",
      unidadCanonica: "var.h",
      flowDirection: "entrante",
      measuringPeriod: "horario",
      tou: "total",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "calculado",
      agregableEntreDispositivos: false,
      emitido: true,
      origen: "calculado-en-backend",
      divisionRequerida: "Medidores Eléctricos",
      estado: "prod",
      descripcion: "OBIS 3.8.0 — energía reactiva",
    },
    demandaMaxImportadaW: {
      dominio: "proceso",
      commodity: "electricidad",
      quantityKind: "potencia",
      // El extremo alcanzado DENTRO de la hora. No es acumulado ni instantáneo.
      accumulation: "extremoIntervalo",
      unidadCanonica: "W",
      flowDirection: "entrante",
      measuringPeriod: "horario",
      tou: "total",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "medido",
      agregableEntreDispositivos: false,
      emitido: true,
      origen: "medido-por-equipo",
      divisionRequerida: "Medidores Eléctricos",
      estado: "prod",
      descripcion:
        "OBIS 1.6.0 — snapshot al cierre de la hora. Extremo del intervalo: se agrega con max, nunca sum",
    },
    demandaMaxExportadaW: {
      dominio: "proceso",
      commodity: "electricidad",
      quantityKind: "potencia",
      accumulation: "extremoIntervalo",
      unidadCanonica: "W",
      flowDirection: "saliente",
      measuringPeriod: "horario",
      tou: "total",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "medido",
      agregableEntreDispositivos: false,
      emitido: true,
      origen: "medido-por-equipo",
      divisionRequerida: "Medidores Eléctricos",
      estado: "prod",
      descripcion:
        "OBIS 2.6.0 — pico de inyección. Con generación distribuida el límite del activo es bidireccional",
    },
    whImportadaT1: {
      dominio: "proceso",
      commodity: "electricidad",
      quantityKind: "energia",
      accumulation: "delta",
      unidadCanonica: "W.h",
      flowDirection: "entrante",
      measuringPeriod: "horario",
      tou: "T1",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "calculado",
      agregableEntreDispositivos: false,
      // Las bandas suman al total, así que mezclar una banda CON el total es
      // doble conteo. Sirven para perfilar demanda por franja horaria.
      particion: {
        esParteDe: "registromedidorelectricos/NME#whImportada",
        sumanAlTotal: true,
      },
      emitido: true,
      origen: "calculado-en-backend",
      divisionRequerida: "Medidores Eléctricos",
      estado: "prod",
      descripcion: "OBIS 1.8.0.1 — banda horaria 1",
    },
  },
};

/**
 * Catálogo de perfiles. **Slice deliberado**: NUC y NME.
 *
 * Agregar una familia es agregar una entrada acá; no toca nada de lo publicado.
 */
/**
 * Variable SCADA: un reporte por muestra, forma angosta. Unidad, tipo y si es booleana salen del `IScada`. El tag
 * es único por cliente (también con varias fuentes: `FIX02.TAG`), por eso la identidad es `device.tag`.
 * Sin discriminante por `deviceTipo`: el reporte SCADA se reconoce por `device.tag`.
 */
export const PERFIL_SCADA: IPerfilLectura = {
  clave: "SCADA",
  origen: "reportes",
  discriminante: {},
  forma: "angosto",
  canalUnico: { campoValor: "valores.valorActual", identidad: "device.tag", descriptorDesdeInstancia: true },
  descripcion: "Variable SCADA (iFIX por OPC-UA)",
};

/** `reportes/SCADA#tag:<tag>`: cómo se guarda una variable SCADA en un preset o una vista. */
export function canalScada(tag: string): string {
  return canalRef("reportes", "SCADA", `tag:${tag}`);
}

/** Inverso de `canalScada`; `null` si el canal no es de una variable SCADA. */
export function tagDeCanalScada(ref: string): string | null {
  const p = parseCanalRef(ref);
  if (!p || p.origen !== "reportes" || p.perfil !== "SCADA" || !p.selector.startsWith("tag:")) return null;
  return p.selector.slice(4) || null;
}

/**
 * Presión de una unidad de presión (NSP o Veribox), por **división** y no por familia: los dos guardan en
 * `reportes` con `valores.presion` e `idsAsignados` con el punto, así que un preset sigue andando si el punto
 * cambia de equipo. `rangoPlausible.min = 0` deja afuera el `-1` de sensor en falla y las presiones negativas,
 * como ya hace gas-cron con NSP y Veribox. La temperatura del NSP no se publica: el firmware la manda en 0.
 */
export const PERFIL_PRESION: IPerfilLectura = {
  clave: "Presion",
  origen: "reportes",
  discriminante: {},
  forma: "ancho",
  descripcion: "Presión de la unidad de presión del punto (NSP o Veribox)",
  campos: {
    "valores.presion": {
      dominio: "proceso",
      commodity: "gas",
      quantityKind: "presion",
      accumulation: "instantaneous",
      unidadCanonica: "bar",
      flowDirection: "na",
      measuringPeriod: "periodoReporte",
      tou: "na",
      condicionMedicion: "na",
      tipoValor: "numerico",
      rol: "medida",
      naturaleza: "medido",
      agregableEntreDispositivos: false,
      referencia: "manometrica",
      rangoPlausible: { min: 0, max: 100 },
      emitido: true,
      origen: "medido-por-equipo",
      divisionRequerida: "Presión",
      estado: "prod",
    },
  },
};

/** Ejes comunes de los canales de clima: modelados por el proveedor en el centroide de la Localidad. */
const AMBIENTE = {
  dominio: "ambiente",
  commodity: "na",
  accumulation: "instantaneous",
  flowDirection: "na",
  measuringPeriod: "horario",
  tou: "na",
  condicionMedicion: "na",
  tipoValor: "numerico",
  rol: "medida",
  naturaleza: "estimado",
  agregableEntreDispositivos: false,
  emitido: true,
  estado: "prod",
} as const;

/**
 * Clima de una Localidad (`registroclimas`, gas-api-clima): **no lo mide un equipo**, lo modela el proveedor en el
 * centroide de la Localidad (`naturaleza: "estimado"`). Se identifica por Localidad o Centro Operativo, no por punto.
 * Sin `divisionRequerida`: lo habilita el módulo clima del cliente y del usuario.
 *
 * Serie horaria: una muestra por hora con la observación y el pronóstico horario de la última corrida para esa
 * hora, promediados — la misma regla que el resumen diario por Localidad. La dirección del viento no se publica:
 * es un ángulo y no admite promedio, mínimo ni máximo. La humedad no se publica para gráficos.
 */
export const PERFIL_CLIMA: IPerfilLectura = {
  clave: "Clima",
  origen: "registroclimas",
  discriminante: {},
  forma: "ancho",
  descripcion: "Clima de la Localidad (modelado en su centroide)",
  campos: {
    temperatura: {
      ...AMBIENTE,
      quantityKind: "temperatura",
      unidadCanonica: "Cel",
      rangoPlausible: { min: -60, max: 60 },
      descripcion: "Temperatura ambiente",
    },
    sensacionTermica: {
      ...AMBIENTE,
      quantityKind: "temperatura",
      unidadCanonica: "Cel",
      rangoPlausible: { min: -80, max: 70 },
      descripcion: "Sensación térmica",
    },
    "viento.velocidad": {
      ...AMBIENTE,
      quantityKind: "velocidad",
      unidadCanonica: "m/s",
      rangoPlausible: { min: 0, max: 120 },
      descripcion: "Velocidad del viento",
    },
    presionAtmosferica: {
      ...AMBIENTE,
      quantityKind: "presion",
      unidadCanonica: "hPa",
      referencia: "absoluta",
      rangoPlausible: { min: 800, max: 1100 },
      descripcion: "Presión atmosférica",
    },
  },
};

export const CATALOGO_CANALES: IPerfilLectura[] = [
  PERFIL_NUC_CORRECTORA,
  PERFIL_NME,
  PERFIL_SCADA,
  PERFIL_PRESION,
  PERFIL_CLIMA,
];

/** Canales de clima que ofrece el gráfico personalizado, en el orden del selector. */
export const CANALES_CLIMA: string[] = Object.keys(PERFIL_CLIMA.campos!).map((c) =>
  canalRef("registroclimas", PERFIL_CLIMA.clave, c),
);

/** Si el `CanalRef` es de clima (se pide por Localidad o Centro Operativo, no por punto). */
export function esCanalClima(ref: string): boolean {
  return CANALES_CLIMA.includes(ref);
}

/** Perfil de un `CanalRef`, o `undefined` si el catálogo no lo cubre. */
export function perfilDe(ref: string): IPerfilLectura | undefined {
  const partes = parseCanalRef(ref);
  if (!partes) return undefined;
  return CATALOGO_CANALES.find((p) => p.origen === partes.origen && p.clave === partes.perfil);
}

/**
 * Canales que el gráfico personalizado ofrece por punto, según la división del punto (P56 § 6). SCADA no está:
 * sus canales son las variables del punto (`canalScada(tag)`).
 */
export const CANALES_GRAFICABLES: Partial<Record<Division, string[]>> = {
  "Presión": [canalRef("reportes", "Presion", "valores.presion")],
  Correctoras: [
    canalRef("registros", "NUC", "presion"),
    canalRef("registros", "NUC", "temperatura"),
    canalRef("registros", "NUC", "caudalPromedio"),
  ],
};

/** Descriptor de un `CanalRef`, o `undefined` si el catálogo no lo cubre. */
export function descriptorDe(ref: string): ICanalDescriptor | undefined {
  const partes = parseCanalRef(ref);
  if (!partes) return undefined;
  const perfil = CATALOGO_CANALES.find(
    (p) => p.origen === partes.origen && p.clave === partes.perfil,
  );
  return perfil?.campos?.[partes.selector];
}
