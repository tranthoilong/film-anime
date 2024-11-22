export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  pagination?: PaginationInfo;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
} 