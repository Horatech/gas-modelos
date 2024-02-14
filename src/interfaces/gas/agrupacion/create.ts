import { IAgrupacion } from "./schema";

type Omitir = "_id";

export interface ICreateAgrupacion extends Omit<Partial<IAgrupacion>, Omitir> {}
