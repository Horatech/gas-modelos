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
 * **Nadie consume esto todavía.** Publicarlo no cambia el comportamiento de ningún
 * servicio: es una declaración, y el resolver que la usa llega en F4.
 */

import type { ICanalDescriptor } from "./canal-descriptor";
import type { TipoDispositivoGas } from "../auxiliares/tipoDispositivo";
import type { ModeloCorrectora } from "./mensajes-nuc/mensajes-nuc";

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
 * `tipoDispositivo: 'NUC'` y se distinguen por `versionHardware`.
 */
export interface IDiscriminantePerfil {
  deviceTipo?: TipoDispositivoGas;
  /** NUC v1 (correctora) vs v3 (InputsNuc / GPIO). */
  versionHardware?: string;
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
  discriminante: { deviceTipo: "NUC", versionHardware: "v1" },
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
export const CATALOGO_CANALES: IPerfilLectura[] = [
  PERFIL_NUC_CORRECTORA,
  PERFIL_NME,
];

/** Descriptor de un `CanalRef`, o `undefined` si el catálogo no lo cubre. */
export function descriptorDe(ref: string): ICanalDescriptor | undefined {
  const partes = parseCanalRef(ref);
  if (!partes) return undefined;
  const perfil = CATALOGO_CANALES.find(
    (p) => p.origen === partes.origen && p.clave === partes.perfil,
  );
  return perfil?.campos?.[partes.selector];
}
