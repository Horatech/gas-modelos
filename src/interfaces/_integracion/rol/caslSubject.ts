// Gas
export type ICaslSubjectGas =
  | "all"
  | "Cliente"
  | "Unidad de Negocio"
  | "Centro Operativo"
  | "Cuenca"
  | "Cromatografia";

export const caslSubjectsGas: ICaslSubjectGas[] = [
  "all",
  "Cliente",
  "Unidad de Negocio",
  "Centro Operativo",
  "Cuenca",
  "Cromatografia",
];

// Agro

export type ICaslSubjectAgro = "all" | "Cliente" | "Establecimiento";

export const caslSubjectsAgro: ICaslSubjectAgro[] = [
  "all",
  "Cliente",
  "Establecimiento",
];

//

export type ICaslSubject = ICaslSubjectGas | ICaslSubjectAgro;
