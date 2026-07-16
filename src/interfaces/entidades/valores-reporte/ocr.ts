// Valores de reporte del dispositivo OCR ("SML óptico"): cámara 4G/LTE montada
// sobre el odómetro mecánico de un medidor residencial de gas SIN salida de
// pulsos. El dispositivo fotografía el visor y hace OCR on-device; el backend
// (gas-ocr-worker, RapidOCR/ONNX + Tesseract) corre un OCR de verificación
// independiente y llena los campos `confianzaBackend`/`fuentesAcuerdo`/`estadoOcr`.
// La lectura de facturación se promueve a `auto` solo con consenso + sanidad;
// de lo contrario cae a la cola de revisión humana (`revision`).
//
// Bag plano de campos opcionales, convención del sistema (ver IReporteSML). Los
// campos `imageRef` + `estadoOcr` + `confianzaBackend` lo discriminan de otras
// variantes de IValoresReporte sin ambigüedad.
export interface IReporteOCR {
  // ISO 8601 (nunca Date).
  timestamp?: string;

  // Lectura final del odómetro en m³ (entero.decimal). Familia `consumo` alineada
  // con IReporteSML/IReporteWRC para reusar el render residencial existente.
  lectura?: number;
  consumo?: number; // Acumulado reportado (= lectura del odómetro).
  consumoCorregido?: number; // Acumulado +- consumoInicial cargado en la plataforma.

  // Fuente 1: lectura del propio dispositivo (OCR on-device).
  ocrReadingDevice?: number;
  ocrConfidenceDevice?: number;

  // Fuente 2/3: OCR de verificación del backend.
  confianzaBackend?: number; // 0–1 (fracción). Documentado: fracción, no porcentaje.
  confianzasPorCelda?: number[]; // Confianza por dígito del odómetro.

  // Flags de consenso entre las fuentes (auditoría del gate auto/revision).
  fuentesAcuerdo?: {
    device: boolean;
    rapidocr: boolean;
    tesseract: boolean;
  };

  // Máquina de estados de la lectura:
  // pendiente  -> creada por la ingesta, aún sin OCR backend
  // revision   -> baja confianza / divergencia -> cola de revisión humana
  // auto       -> consenso + sanidad -> auto-aceptada
  // confirmado -> operador validó la lectura auto/manual
  // corregido  -> operador sobreescribió la lectura
  estadoOcr?: "pendiente" | "revision" | "auto" | "confirmado" | "corregido";

  // Key del objeto GCS de la imagen upright (fuente de verdad para auditoría,
  // retención >= 1 año). NO base64 ni URL pública: el frontend obtiene una
  // signed URL v4 de vida corta a partir de este key.
  imageRef?: string;

  // Unidad enviada por el dispositivo (p. ej. "m3").
  meterUnit?: string;

  // Nivel de batería (%). Convención `bateria` de las familias de medidor.
  bateria?: number;
}
