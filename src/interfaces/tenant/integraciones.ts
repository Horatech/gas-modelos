export interface IIntegracion {
  tipoDispositivo?: string;
  tipoIntegracion?: string; // INFLUX / SQL / MONGODB / API REST
  endpoint?: string; // POST https://miapi.com
  credenciales?: IIntegracionInfluxV1 | IIntegracionInfluxV2 | object; // {user: string; pass: string} || {apikey: string}
  ubicacionCredenciales?: "Query Params" | "Headers" | "Body";
}

export interface IIntegracionInfluxV1 {
  host?: string;
  port?: string;
  protocol?: string;
  username?: string;
  password?: string;
  dbName?: string;
  measurement?: string;
}

export interface IIntegracionInfluxV2 {
  host?: string;
  port?: string;
  protocol?: string;
  token?: string;
  dbName?: string;
  measurement?: string;
}
