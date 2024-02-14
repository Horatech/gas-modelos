import { IAgrupacion } from "./schema";

type Omitir = "_id";

export interface IUpdateAgrupacion extends Omit<Partial<IAgrupacion>, Omitir> {}
