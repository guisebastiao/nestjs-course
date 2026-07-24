import { Pagination } from "@/common/dto/pagination";

export class ListResponse<T> {
  list: T[];
  pagination: Pagination;

  constructor(list: T[], pagination: Pagination) {
    this.list = list;
    this.pagination = pagination;
  }

  public static of<T>(list: T[], pagination: Pagination): ListResponse<T> {
    return new ListResponse(list, pagination);
  }
}
