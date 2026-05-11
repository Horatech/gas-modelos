export interface IApplicationV4 {
  id: string;
  name: string;
  description?: string;
  tenantId?: string;
}

export interface IListApplicationsV4Response {
  totalCount?: number;
  result?: IApplicationV4[];
}
