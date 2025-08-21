export interface IInsertManyResult<T> {
  inserted?: T[];
  failed?: T[];
  errors?: string[];
}
