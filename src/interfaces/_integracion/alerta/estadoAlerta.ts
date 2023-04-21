export interface IEstadoAlerta {
  fechaActualizacion?: string;
  activa?: boolean;
  estado?: "Nueva" | "En proceso" | "Resuelta";
}
