/**
 * Cálculo de los períodos de facturación a partir del día de cierre
 * (`IConfigCliente.ciclosFacturacion[division].diaCierre`).
 *
 * **Archivo HOJA a propósito: no importa nada.** Es data pura, sin schema Zod, igual
 * criterio que `canal-descriptor.ts` / `METADATA_ENTIDADES_VINCULABLES`: no se persiste
 * ni viaja en un body. Los backends NestJS lo toman de `'modelos'` (dist) y los
 * frontends Angular por path directo a este archivo.
 *
 * ## Por qué devuelve partes de calendario y no `Date`
 *
 * El corte del período es a las **00:00 locales** (ver `CicloFacturacionSchema`). Un
 * `Date` construido acá tomaría la zona horaria del proceso, y los pods corren en UTC:
 * el mismo período daría tres horas corrido según quién lo calcule. Así que este módulo
 * hace sólo la aritmética de calendario —qué mes y qué día son los bordes— y la
 * conversión a instante concreto la hace quien conoce la zona del usuario (el navegador,
 * con `new Date(anio, mes - 1, dia)`).
 *
 * ## Convención
 *
 * El período **se rotula por el mes en que cierra** y es **media abierta**: el período
 * "Agosto 2026" con `diaCierre: 5` va del 5 de julio 00:00 (inclusive) al 5 de agosto
 * 00:00 (exclusive). Sin solapamientos ni huecos.
 */

/** Un día del calendario, sin hora ni zona. `mes` es 1-12. */
export interface IFechaCalendario {
  anio: number;
  mes: number;
  dia: number;
}

export interface IPeriodoFacturacion {
  /** Año del mes que rotula el período (el del cierre). */
  anio: number;
  /** Mes 1-12 que rotula el período (el del cierre). */
  mes: number;
  /** Primer día del período, INCLUSIVE (00:00 de este día). */
  inicio: IFechaCalendario;
  /** Día de cierre, EXCLUSIVE (el período termina a las 00:00 de este día). */
  fin: IFechaCalendario;
  /** Etiqueta para mostrar: "Agosto 2026". */
  label: string;
}

export const MESES_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/** El rango válido de `diaCierre`. Ver `CicloFacturacionSchema` para el por qué del 28. */
export const DIA_CIERRE_MIN = 1;
export const DIA_CIERRE_MAX = 28;

/**
 * `true` si el valor sirve como día de cierre. Los consumidores usan esto para decidir
 * si la feature está activa: una config vieja o editada a mano con un 31 apaga el
 * selector de período en vez de romper la pantalla.
 */
export function esDiaCierreValido(diaCierre: unknown): diaCierre is number {
  return (
    typeof diaCierre === "number" &&
    Number.isInteger(diaCierre) &&
    diaCierre >= DIA_CIERRE_MIN &&
    diaCierre <= DIA_CIERRE_MAX
  );
}

function validar(diaCierre: number): void {
  if (!esDiaCierreValido(diaCierre)) {
    throw new RangeError(
      `diaCierre inválido: ${diaCierre}. Debe ser un entero entre ${DIA_CIERRE_MIN} y ${DIA_CIERRE_MAX}.`,
    );
  }
}

/** Resta un mes a un (año, mes 1-12), cruzando el año. */
function mesAnterior(anio: number, mes: number): { anio: number; mes: number } {
  return mes === 1 ? { anio: anio - 1, mes: 12 } : { anio, mes: mes - 1 };
}

/** Suma un mes a un (año, mes 1-12), cruzando el año. */
function mesSiguiente(anio: number, mes: number): { anio: number; mes: number } {
  return mes === 12 ? { anio: anio + 1, mes: 1 } : { anio, mes: mes + 1 };
}

/**
 * El período rotulado por (`anio`, `mes`): de `diaCierre` del mes anterior (inclusive)
 * a `diaCierre` de `mes` (exclusive).
 */
export function periodoFacturacion(
  diaCierre: number,
  anio: number,
  mes: number,
): IPeriodoFacturacion {
  validar(diaCierre);
  const previo = mesAnterior(anio, mes);
  return {
    anio,
    mes,
    inicio: { anio: previo.anio, mes: previo.mes, dia: diaCierre },
    fin: { anio, mes, dia: diaCierre },
    label: `${MESES_ES[mes - 1]} ${anio}`,
  };
}

/**
 * En qué período cae una fecha del calendario.
 *
 * El día de cierre pertenece al período SIGUIENTE, porque el borde es exclusive: con
 * `diaCierre: 5`, el 5 de agosto ya es el primer día del período "Septiembre".
 */
export function periodoDeFecha(
  diaCierre: number,
  fecha: IFechaCalendario,
): IPeriodoFacturacion {
  validar(diaCierre);
  if (fecha.dia < diaCierre) {
    return periodoFacturacion(diaCierre, fecha.anio, fecha.mes);
  }
  const siguiente = mesSiguiente(fecha.anio, fecha.mes);
  return periodoFacturacion(diaCierre, siguiente.anio, siguiente.mes);
}

/**
 * Los `cantidad` períodos que terminan en (`anio`, `mes`) o antes, **del más reciente al
 * más viejo** — el orden en que los quiere un selector.
 */
export function periodosFacturacion(
  diaCierre: number,
  anio: number,
  mes: number,
  cantidad: number,
): IPeriodoFacturacion[] {
  validar(diaCierre);
  const periodos: IPeriodoFacturacion[] = [];
  let cursor = { anio, mes };
  for (let i = 0; i < cantidad; i++) {
    periodos.push(periodoFacturacion(diaCierre, cursor.anio, cursor.mes));
    cursor = mesAnterior(cursor.anio, cursor.mes);
  }
  return periodos;
}
