export interface IDeviceProfileV4 {
  id: string;
  name: string;
  region?: string;
  macVersion?: string;
  regParamsRevision?: string;
  supportsOtaa?: boolean;
  supportsClassB?: boolean;
  supportsClassC?: boolean;
  tenantId?: string;
}

export interface IListDeviceProfilesV4Response {
  totalCount?: number;
  result?: IDeviceProfileV4[];
}
