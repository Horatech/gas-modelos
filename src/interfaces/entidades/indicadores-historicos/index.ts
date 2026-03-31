import { Division } from "../../tenant";

export interface IIndicadorHistorico {
  _id?: string;
  fecha?: string; // "2026-03-30"
  idCliente?: string;
  idUnidadNegocio?: string | null;
  idCentroOperativo?: string | null;
  idLocalidad?: string | null;
  division?: Division;

  // Nivel UN — mismo valor para todos los docs de esa UN ese día
  cuencas?: number;

  // Puntos de medición — conteos por estado
  totalPuntos?: number;
  operativos?: number;
  incompletos?: number;
  enAlerta?: number;
  aResolver?: number;
  enMantenimiento?: number;
  sinDispositivo?: number;
  sinReportar?: number;
  dadosDeBaja?: number;

  // Dispositivos tradicionales
  totalDispositivos?: number;
  puntosConDispositivo?: number;

  // SCADA
  totalDispositivosScada?: number;
  puntosScadaConDispositivo?: number;
}

type OmitirCreate = "_id";
export interface ICreateIndicadorHistorico
  extends Omit<Partial<IIndicadorHistorico>, OmitirCreate> {}
