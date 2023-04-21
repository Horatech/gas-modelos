export interface IConfigNUC {
  horaInicio?: number;
  modoOperacion?: modoOperacion;
  modoEnv?: "TEST" | "PROD";
  claveMercury?: string;
  //
  readonly firmwareNuc?: string;
  readonly apiVersion?: string;
}

export type modoOperacion =
  | "consumos"
  | "REG1_DIARIO"
  | "REG1_1HORA"
  | "REG2_2HORAS"
  | "REG3_3HORAS"
  | "REG4_4HORAS"
  | "REG6_6HORAS"
  | "REG8_8HORAS"
  | "REG12_12HORAS"
  | "REG24_DIARIO";

export const MODOS_OPERACION: { value: modoOperacion; viewValue: string }[] = [
  { value: "consumos", viewValue: "1 Reporte por día de 24 Registros" },
  { value: "REG1_DIARIO", viewValue: "1 Reporte por día de 1 Registro" },
  { value: "REG1_1HORA", viewValue: "24 Reportes por día de 1 Registro" },
  { value: "REG2_2HORAS", viewValue: "12 Reportes por día de 2 Registros" },
  { value: "REG3_3HORAS", viewValue: "8 Reportes por día de 3 Registros" },
  { value: "REG4_4HORAS", viewValue: "6 Reportes por día de 4 Registros" },
  { value: "REG6_6HORAS", viewValue: "4 Reportes por día de 6 Registros" },
  { value: "REG8_8HORAS", viewValue: "3 Reportes por día de 8 Registros" },
  { value: "REG12_12HORAS", viewValue: "2 Reportes por día de 12 Registros" },
  { value: "REG24_DIARIO", viewValue: "1 Reporte por día de 24 Registros" },
];
