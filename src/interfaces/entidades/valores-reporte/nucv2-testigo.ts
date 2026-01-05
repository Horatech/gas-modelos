// solo puede enviar 1 como valor por firmware nuc-v2
// Caso contrario, no saltó el testigo (no hay mensaje de testigo)
export interface ITestigoNUCV2 {
  fechaCreacion?: string;
  testigo_1?: number;
  testigo_2?: number;
}
