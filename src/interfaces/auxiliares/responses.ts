export interface IInsertManyResult<T> {
  inserted?: T[];
  failed?: T[];
  errors?: string[];
  duration?: number;
}

export interface IDeleteManyResult<T> {
  deleted?: T[];
  failed?: T[];
  errors?: string[];
  duration?: number;
}

export interface IUpdateManyResult<T> {
  original?: T[];
  updated?: T[];
  failed?: T[];
  errors?: string[];
  duration?: number;
}

export interface IInsertResult<T> {
  inserted?: T;
  duration?: number;
}

export interface IDeleteResult<T> {
  deleted?: T;
  duration?: number;
}

export interface IUpdateResult<T> {
  original?: T;
  updated?: T;
  duration?: number;
}
