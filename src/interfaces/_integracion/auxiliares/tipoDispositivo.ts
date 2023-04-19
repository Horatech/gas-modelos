export type TipoDispositivo = TipoDispositivoAgro | TipoDispositivoGas;

export type TipoDispositivoAgro =
  | "Bomba de Cisterna"
  | "Caravana"
  | "Estacion de Bombeo"
  | "Estacion Meteorologica"
  | "Freatimetro"
  | "Nivel de Canal"
  | "Nivel de Cisterna"
  | "Nivel de Comederos"
  | "Nivel de Láminas de Agua"
  | "Nivel de Represas"
  | "Pluviometro"
  | "Sensor de CO2"
  | "Sensor Humedad de Suelo"
  | "Tracker";

export const TIPOS_DISPOSITIVOS_AGRO: TipoDispositivoAgro[] = [
  "Bomba de Cisterna",
  "Caravana",
  "Estacion de Bombeo",
  "Estacion Meteorologica",
  "Freatimetro",
  "Nivel de Canal",
  "Nivel de Cisterna",
  "Nivel de Comederos",
  "Nivel de Láminas de Agua",
  "Nivel de Represas",
  "Pluviometro",
  "Sensor de CO2",
  "Sensor Humedad de Suelo",
  "Tracker",
];

export type TipoDispositivoGas = "NUC" | "SML" | "MRA";

export const TIPOS_DISPOSITIVOS: TipoDispositivoGas[] = ["NUC", "SML", "MRA"];
