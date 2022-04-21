export interface ICreateApplicationChirpstack {
  application: {
    description: string;
    id?: string;
    name: string;
    organizationID: string;
    payloadCodec?: string;
    payloadDecoderScript?: string;
    payloadEncoderScript?: string;
    serviceProfileID: string;
  };
}
