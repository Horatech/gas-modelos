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

// Códigos de defecto de lectura que emite el pipeline del worker (gas-ocr-worker)
// para explicar por qué una lectura falló o fue a revisión. Multi-etiqueta: una
// lectura puede acumular varios. La etapa/umbral/acción de cada uno está en
// gas/PLAN-OCR-PIPELINE.md (§3). Se persisten en `defectosLectura`.
export type DefectoLecturaOCR =
  | "IMAGEN_ILEGIBLE" // no se pudo decodificar la imagen
  | "NO_ES_MEDIDOR" // el ROI no parece un visor de medidor mecánico
  | "REGISTRO_NO_LOCALIZADO" // no se encontró la banda de dígitos
  | "IMAGEN_CORTADA" // el registro queda fuera del cuadro
  | "IMAGEN_INCLINADA" // skew no corregible por rectificación
  | "BORROSA" // baja nitidez (varianza de Laplaciano baja)
  | "GLARE_SEVERO" // reflejo especular tapa celdas del registro
  | "ROLL_PARCIAL" // una rueda a medio girar (dígito en transición)
  | "DIGITOS_INSUFICIENTES" // se leyeron menos dígitos que el ancho del registro
  | "BAJA_CONFIANZA" // confianza del OCR backend bajo el umbral
  | "DIVERGENCIA_DEVICE" // lectura backend difiere de la del dispositivo
  | "NO_MONOTONICO" // lectura menor que la última verificada del medidor
  | "EXCESO_DIGITOS"; // más dígitos que el máximo plausible (ROI contaminado)

export interface IReporteOCR {
  // ISO 8601 (nunca Date).
  timestamp?: string;

  // Lectura final del odómetro en m³ (entero.decimal). Familia `consumo` alineada
  // con IReporteSML/IReporteWRC para reusar el render residencial existente.
  lectura?: number;
  consumo?: number; // Acumulado reportado (= lectura del odómetro).
  consumoCorregido?: number; // Acumulado +- consumoInicial cargado en la plataforma.
  // Consumo parcial desde el último reporte (consumoCorregido de este reporte -
  // consumoCorregido del último reporte del medidor). A diferencia de SML/WRC —que
  // reportan consumoInstantaneo desde el propio device—, el dispositivo OCR solo
  // entrega la lectura acumulada del odómetro, así que el parcial se CALCULA en el
  // backend. Misma convención que consumoParcialInputN (NUC) y flujo*Parcial (agua).
  consumoParcial?: number;
  // Tiempo transcurrido desde el último reporte, en segundos (timestamp de este
  // reporte - timestamp del último reporte del medidor). Contextualiza el parcial:
  // permite derivar una tasa de consumo (consumoParcial / intervalo) y validar la
  // cadencia. Se calcula en el backend junto con consumoParcial. En segundos (no
  // intervaloHoras como EUW300/BOVE) porque la cadencia del OCR es variable.
  intervaloReporteSegundos?: number;

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

  // Defectos de lectura detectados por el pipeline del worker (multi-etiqueta).
  // Explican por qué la lectura fue a `revision`/rechazo; alimentan reportes de
  // lecturas fallidas y la cola de revisión. Ver DefectoLecturaOCR.
  defectosLectura?: DefectoLecturaOCR[];
}
