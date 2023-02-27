export interface IIntegraciones {
  tipoDispositivo: string;
  tipoIntegracion: string; // INFLUX / SQL / MONGODB / API REST
  endpoint: string; // POST https://miapi.com
  creadenciales: object; // {user: string; pass: string} || {apikey: string}
  ubicacionCredenciales: "Query Params" | "Headers" | "Body";
}
