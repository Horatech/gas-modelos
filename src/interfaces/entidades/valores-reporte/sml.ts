import { z } from "zod";

export const ReporteSMLSchema = z.object({
  tipo: z.enum(["SindCon", "Hac"]).optional(),
  header: z.number().optional(),
  paquetSequence: z.number().optional(),
  deviceMeterNumber: z.number().optional(),
  pulseConstant: z.number().optional(),
  meterType: z.number().optional(),
  meteringMode: z.number().optional(),
  meter_reading: z.number().optional(),
  reverse_accumulated_flow: z.number().optional(),
  batteryVoltage: z.number().optional(),
  statusWord: z.number().optional(),
  // Código de unidad de caudal del medidor (byte de unidad de la trama, familia
  // ML107A Reallin/HolleyBeta). Determina el factor de escala del flujo acumulado
  // a m³. Enum del fabricante: 0x29 L (÷1000), 0x2A L×10 (÷100), 0x2B L×100 (÷10),
  // 0x2C m³ (×1), 0x2D m³×10 (×10), 0x2E m³×100 (×100). Se persiste el código crudo
  // para trazabilidad; el consumo ya viene escalado con el factor correspondiente.
  unidad: z.number().optional(),
  triggerSource: z.number().optional(),
  checksum: z.number().optional(),
  // Parsed
  // Instante en que la lectura entró a la plataforma (ISO, UTC). Es la fecha con
  // la que se indexa y se ordena la serie.
  timestamp: z.string().optional(),
  // Instante en que el MÓDULO tomó la muestra (ISO, UTC), leído del reloj que
  // viaja en la trama larga del ML107A. El módulo lo emite en su hora local; acá
  // se guarda ya normalizado a UTC, como el resto de las fechas del sistema.
  // Ausente cuando la trama no trae reloj (trama corta) o cuando el reloj del
  // equipo está demasiado desfasado del momento de recepción para ser creíble.
  // Es la fecha de MEDICIÓN, en contraste con `timestamp`, que es la de registro.
  timestampDispositivo: z.string().optional(),
  consumoNegativo: z.number().optional(), // Es el consumo acumulado en sentido negativo reportado por el dispositivo
  consumoPositivo: z.number().optional(), // Es el consumo acumulado en sentido positivo reportado por el dispositivo
  consumo: z.number().optional(), // Es el consumo acumulado reportado por el dispositivo // restando lo negativo
  /**
   * Acumulado del MEDIDOR (el dial del medidor físico), no del dispositivo:
   * `consumoInicial + arrastreDispositivos + (consumo - lecturaInicialDispositivo)`.
   *
   * **Ausente cuando no se puede afirmar.** Si el odómetro queda por debajo del
   * baseline del medidor, el reporte va sin este campo y con `baselineIncoherente`
   * en `true`. Antes se clampeaba con `Math.max(0, ...)`, que dejaba el acumulado
   * planchado en `consumoInicial` durante días y después saltaba, sin más rastro
   * que un `Logger.warn`.
   */
  consumoCorregido: z.number().optional(),
  /**
   * El odómetro del dispositivo quedó por debajo de `lecturaInicialDispositivo`, así
   * que `consumoCorregido` no se pudo calcular y va ausente.
   *
   * Causas conocidas: baseline tomado de un uplink posterior a la instalación, wrap
   * del registro del equipo (ver el techo de 99.000 m³ del odómetro decimal), o fecha
   * de asignación mal cargada. Es la señal para encontrar los equipos que esperan
   * intervención — mismo rol que `regresionAcumulado` en `IRegistroMedidorElectrico`.
   */
  baselineIncoherente: z.boolean().optional(),
  // Consumo del período = `consumo` de este reporte - `consumo` del último reporte
  // del medidor. Se usa el ODÓMETRO del dispositivo, NO `consumoCorregido`: el
  // corregido lleva el dial inicial del medidor y el arrastre, y si esos se editan
  // el reporte siguiente daría un parcial espurio. El dispositivo SML/MRA reporta el
  // acumulado, no el parcial, así que se CALCULA en el backend (misma convención que
  // OCR/NUC/agua). undefined en el primer reporte (sin acumulado anterior).
  consumoParcial: z.number().optional(),
  consumoInstantaneo: z.number().optional(), // Es el consumo instantaneo reportado por el dispositivo
  bateria: z.number().optional(),
});
export type IReporteSML = z.infer<typeof ReporteSMLSchema>;
