import { z } from "zod";

// export type TipoDispositivoAgro =
//   | "Bomba de Cisterna"
//   | "Caravana"
//   | "Estacion de Bombeo"
//   | "Estacion Meteorologica"
//   | "Freatimetro"
//   | "Nivel de Canal"
//   | "Nivel de Cisterna"
//   | "Nivel de Comederos"
//   | "Nivel de Láminas de Agua"
//   | "Nivel de Represas"
//   | "Pluviometro"
//   | "Sensor de CO2"
//   | "Sensor Humedad de Suelo"
//   | "Tracker";

// export const TIPOS_DISPOSITIVOS_AGRO: TipoDispositivoAgro[] = [
//   "Bomba de Cisterna",
//   "Caravana",
//   "Estacion de Bombeo",
//   "Estacion Meteorologica",
//   "Freatimetro",
//   "Nivel de Canal",
//   "Nivel de Cisterna",
//   "Nivel de Comederos",
//   "Nivel de Láminas de Agua",
//   "Nivel de Represas",
//   "Pluviometro",
//   "Sensor de CO2",
//   "Sensor Humedad de Suelo",
//   "Tracker",
// ];

export const TipoDispositivoGasSchema = z.enum([
  "NUC",
  "SML",
  "MRA",
  "NSP",
  "VERIBOX MICRO",
  "WRC",
  "SCADA Unifilares",
  "SCADA Mediciones",
  "ML107A",
  "EUW300",
  "BOVE",
  "ML107GH",
  "NME",
  "OCR",
  "UWM-NB",
]);
export type TipoDispositivoGas = z.infer<typeof TipoDispositivoGasSchema>;

export const TipoDispositivoSchema =
  // TipoDispositivoAgroSchema |
  TipoDispositivoGasSchema;
export type TipoDispositivo = TipoDispositivoGas;

export const TIPOS_DISPOSITIVOS = TipoDispositivoGasSchema.options;
