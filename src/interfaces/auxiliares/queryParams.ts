export interface IQueryParam {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  filter?: string;
  populate?: string;
  select?: string;
  [key: string]: any;
}

export interface IFilter {
  [key: string]: any;
}

export interface IPopulate {
  path?: string;
  select?: string;
  populate?: IPopulate;
  [key: string]: any;
}
