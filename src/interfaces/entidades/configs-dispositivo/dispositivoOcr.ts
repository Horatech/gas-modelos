import { z } from "zod";

// Configuración del dispositivo cámara OCR ("SML óptico"): fotografía el odómetro
// mecánico de un medidor residencial de gas sin salida de pulsos y manda la imagen
// al backend, que la lee (gas-ocr-worker).

// Modelos de medidor que el clasificador de dígito por rueda tiene ENTRENADOS.
// El clasificador se entrena con crops del odómetro real: en el medidor con el que
// se entrenó lee bien y en uno que nunca vio la precisión cae a la mitad, así que
// el worker lo aplica SOLO a los modelos de esta lista y para el resto usa el OCR
// de línea, que ante la duda se abstiene. Es un enum y no texto libre a propósito:
// un modelo mal tipeado deshabilitaba el clasificador en silencio.
// El detalle de con qué datos se entrenó cada uno y sus métricas vive junto al
// modelo, en gas-ocr-worker: `ocr_worker/models/entrenamiento.json`.
export const ModeloMedidorOcrSchema = z.enum(["DAESUNG G2.5", "DAESUNG G4"]);
export type ModeloMedidorOcr = z.infer<typeof ModeloMedidorOcrSchema>;

// Ventana del registro del contador dentro del cuadro, en coordenadas
// FRACCIONALES (0–1) sobre la imagen ya enderezada, más la rotación necesaria
// para dejar los dígitos horizontales. La cámara va montada rígida sobre el
// medidor, así que el registro cae siempre en la misma región: se calibra una vez
// por equipo (tools/calibrar_roi.py) en lugar de detectarlo en cada foto, que
// arriesga leer los rótulos del medidor (DAESUNG / SAMPLE / Qmax / el año).
export const OcrRoiSchema = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  rot: z.enum(["cw", "ccw", "180"]).optional(),
});
export type IOcrRoi = z.infer<typeof OcrRoiSchema>;

export const DispositivoOcrSchema = z.object({
  // Identidad y acceso. El equipo autentica con `x-api-key`; en producción se
  // valida contra `apiKey` (por equipo), en test la validación está apagada.
  imei: z.string().optional(),
  apiKey: z.string().optional(),

  // Calibración de lectura.
  ocrRoi: OcrRoiSchema.optional(),
  // Ruedas ENTERAS del contador: define dónde cae la coma y permite validar la
  // cantidad de dígitos leídos. Sin esto no se puede separar entero de decimal.
  anchoRegistro: z.number().optional(),
  // Total de ruedas del registro (enteras + decimales).
  ocrCeldas: z.number().optional(),
  // Ruedas que NO se leen, por índice desde la izquierda (0-based). Se usa para
  // las que el encuadre de la cámara corta: leerlas devuelve un dígito inventado
  // con confianza baja que mandaría toda la lectura a revisión.
  ocrCeldasIgnoradas: z.array(z.number()).optional(),
  // Modelo del medidor fotografiado: decide si aplica el clasificador por rueda.
  modeloMedidor: ModeloMedidorOcrSchema.optional(),
});
export type IDispositivoOcr = z.infer<typeof DispositivoOcrSchema>;
