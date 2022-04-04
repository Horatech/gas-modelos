export interface IQueryFilter {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  /**
   * @description
   * Es un array IFilter en string
   * @example
   * filter = JSON.stringify([
   *  {
   *   field: 'nombre',
   *   type: string,
   *   value: 'nombre',
   *  },
   *  {
   *   field: 'idCliente',
   *   type: objectid,
   *   value: 'idCliente',
   *  },
   * ]);
   */
  filter?: string;
  /**
   * @description
   * Representa un string u objeto para populate tal cual lo recibe mongoose para la query
   * @example
   * populate = 'cliente'
   * populate = JSON.stringify({
   *  path: 'cliente',
   *  select: 'nombre',
   * });
   */
  populate?: string;
  select?: string;
  [key: string]: any;
}

export interface IFilter {
  field: string | string[];
  type:
    | "number"
    | "string"
    | "boolean"
    | "date"
    | "object"
    | "regex"
    | "objectid";
  value: any;
}
