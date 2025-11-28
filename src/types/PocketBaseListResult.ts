export type PocketBaseListResult<T> = {
  items: T[];
  totalItems: number;
  page: number;
  perPage: number;
  totalPages: number;
};