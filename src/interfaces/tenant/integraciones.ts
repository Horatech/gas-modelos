export interface IIntegracion {
  tipoDispositivo?: string;
  tipoIntegracion?: "INFLUXV1" | "INFLUXV2" | "HTTPS" | "FTP"; // SQL / MONGODB
  endpoint?: string; // https://miapi.com
  puerto?: number; // 8080
  method?: "GET" | "POST" | "PUT" | "PATCH";
  credenciales?: IIntegracionInfluxV1 | IIntegracionInfluxV2;
  credenciales2?: { key: string; value: string }[];
  ubicacionCredenciales?: "Query Params" | "Headers" | "Body";
  // Integración de altas/asociaciones + devolución de lecturas (p. ej. Manantial
  // de AYSAM). Las integraciones históricas modelan push OUTBOUND; estos campos
  // agregan la ingesta pull INBOUND y el perfil del adaptador.
  direccion?: "INBOUND_PULL" | "OUTBOUND_API";
  perfil?: "MANANTIAL"; // adaptador/mapper específico del sistema externo
  endpointIngesta?: string; // base del GET de altas (p. ej. .../mediciones/v1)
  // Watermark de la ingesta incremental (idempotencia / "solo lo nuevo").
  cursorAltas?: string;
  ultimaSincronizacion?: string;
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
  org?: string;
}
