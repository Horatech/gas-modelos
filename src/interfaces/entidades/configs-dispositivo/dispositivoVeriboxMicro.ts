export interface IDispositivoVeriboxMicro {
  // Config Reportada por las auditorias
  frecuenciaComunicacion?: number;
  limiteMin?: number;
  limiteMax?: number;
  apn?: string;
  usuario?: string;
  clave?: string;
  // Migracion
  telefono?: string;
  operadora?: string;
  migrar?: boolean;
  fechaMigrar?: string;
}
