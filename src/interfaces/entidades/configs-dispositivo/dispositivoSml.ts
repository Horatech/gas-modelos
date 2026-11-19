import { z } from "zod";
import type { ITipoAlerta } from "../alerta";

/**
 * Tipos de alerta que un equipo SML / WRC / MRA puede tener ignorados
 * (`config.alertasIgnoradas`). Sólo los que reporta el propio equipo: "Sin Reportar"
 * la abre gas-cron por ausencia de datos y no se puede ignorar.
 *
 * Enum propio y no `TipoAlertaSchema.extract(...)`: `alerta.ts` es del SCC de
 * `IDispositivo` y tomarlo como valor desde acá cierra un ciclo runtime. El
 * `satisfies` mantiene la lista atada al enum único a nivel de tipos.
 */
export const TIPOS_ALERTA_IGNORABLES_SML = [
  "Batería baja",
  "Sensor desconectado",
  "Ataque magnético",
  "Flujo inverso",
  "Falla de medición",
] as const satisfies readonly ITipoAlerta[];
export const TipoAlertaIgnorableSmlSchema = z.enum(TIPOS_ALERTA_IGNORABLES_SML);
export type ITipoAlertaIgnorableSml = z.infer<typeof TipoAlertaIgnorableSmlSchema>;

export const DispositivoSmlSchema = z.object({
  // Comunicacion
  serialNumber: z.string().optional(),
  imei: z.string().optional(),
  ip: z.string().optional(), // IP desde la cual se comunica el dispositivo
  port: z.number().optional(),

  // Info de la sim
  iccid: z.number().optional(),
  operadora: z.string().optional(),
  telefono: z.string().optional(),

  valorAlarmaBateria: z.number().optional(),

  // Alertas ignoradas: equipos que en campo reportan una alarma de forma permanente
  // aunque midan bien (típico: "Falla de medición"). La ingesta (gas-sml) cierra la
  // abierta de esos tipos y no abre nuevas; al cambiar la lista, gas-admin cierra en
  // el momento las abiertas y recalcula el punto vía gas-datos. Sólo lo ve el admin.
  alertasIgnoradas: z.array(TipoAlertaIgnorableSmlSchema).optional(),

  // Configuracion del SML
  // valveControl?: boolean;
  calibrationDeviceNodeReading: z.number().optional(),
  reportingCycleInterval: z.number().optional(), // Segundos
  timezone: z.string().optional(), // UTC+2 | UTC-3 | etc.
  ipReporte: z.string().optional(), // La IP de a donde va a reportar -> 47.92.222.233 :1822
  pn: z.number().optional(), // Pulse number
  maximunMeterReading: z.number().optional(), // Valor maximo del medidor
  reportingRange: z.number().optional(), // 321: 0321 3--3+21/2 ,Means to report randomly in the range of 3-13:30
});
export type IDispositivoSml = z.infer<typeof DispositivoSmlSchema>;

/**
 * `POST /dispositivos/alertas-ignoradas` (gas-datos, vía gas-admin): cambia
 * `config.alertasIgnoradas` de uno o varios equipos SML / WRC / MRA y cierra en el
 * momento las alertas abiertas de los tipos que quedan ignorados.
 *
 * - `reemplazar`: la lista pasa a ser `tipos` (vacía = no ignora nada).
 * - `agregar` / `quitar`: suma o saca `tipos` de la lista de cada equipo; es lo que
 *   usa la acción masiva para no pisar listas distintas entre equipos.
 */
export const ModoAlertasIgnoradasSchema = z.enum(["reemplazar", "agregar", "quitar"]);
export type IModoAlertasIgnoradas = z.infer<typeof ModoAlertasIgnoradasSchema>;

export const MAX_DISPOSITIVOS_ALERTAS_IGNORADAS = 1000;

export const ActualizarAlertasIgnoradasSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(MAX_DISPOSITIVOS_ALERTAS_IGNORADAS),
  tipos: z.array(TipoAlertaIgnorableSmlSchema),
  modo: ModoAlertasIgnoradasSchema,
});
export type IActualizarAlertasIgnoradas = z.infer<typeof ActualizarAlertasIgnoradasSchema>;

export const ResultadoAlertasIgnoradasSchema = z.object({
  /** Equipos SML / WRC / MRA actualizados (los ids de otros tipos se descartan). */
  dispositivos: z.number(),
  alertasCerradas: z.number(),
  puntosActualizados: z.number(),
  medidoresActualizados: z.number(),
});
export type IResultadoAlertasIgnoradas = z.infer<typeof ResultadoAlertasIgnoradasSchema>;
