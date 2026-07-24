export class Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  constructor(page: number, limit: number, total: number, totalPages: number) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = totalPages;
  }

  public static of(page: number, limit: number, total: number, totalPages: number): Pagination {
    return new Pagination(page, limit, total, totalPages);
  }
}
