/**
 * Helpers de clima. Funcion pura, sin dependencias y browser-safe: la compilan
 * NestJS (gas-api-clima, gas-api-cliente) y Angular (gas-web-cliente).
 */

/**
 * Sensacion termica por **wind chill** (formula JAG/TI, la que usan el NWS y
 * Environment Canada). Temperatura en °C, viento en **m/s**. Devuelve °C.
 *
 * Vive aca —y no en cada servicio— porque la necesitan dos consumidores y tiene
 * que dar el MISMO numero en los dos:
 *
 * 1. `gas-api-clima`, para el pronostico DIARIO: One Call 4.0 devuelve
 *    `feels_like` identico a `temp` en todas las franjas del timeline diario
 *    (verificado en produccion: 0 de 3949 registros diarios difieren, incluso con
 *    6,6 m/s de viento), o sea que ese campo del proveedor no aporta nada. En el
 *    timeline HORARIO si es real y no se toca.
 * 2. `gas-api-cliente`, como respaldo de la serie diaria: los rollups anteriores a
 *    que existiera el campo no tienen sensacion termica, y sin esto la serie
 *    quedaria con un solo punto.
 *
 * La formula reproduce el `feels_like` horario del propio proveedor con un error
 * de ±0,02 °C (400 muestras contra produccion), asi que el valor derivado es
 * consistente con el que entrega OpenWeatherMap por hora.
 *
 * Fuera del rango de validez (T > 10 °C o viento < 4,8 km/h) la sensacion **es**
 * la temperatura: por debajo de esa velocidad el viento no enfria. NO cubre el
 * indice de calor (temperatura alta + humedad); para gas la franja que importa es
 * la fria.
 */
export function windChillC(
  tempC?: number | null,
  vientoMs?: number | null,
): number | undefined {
  if (typeof tempC !== "number") return undefined;
  if (typeof vientoMs !== "number") return tempC;
  const vKmh = vientoMs * 3.6;
  if (tempC > 10 || vKmh < 4.8) return tempC;
  const f = Math.pow(vKmh, 0.16);
  const wci = 13.12 + 0.6215 * tempC - 11.37 * f + 0.3965 * tempC * f;
  return Math.round(wci * 100) / 100;
}
