import { ApiResponse, PaginationInfo, PaginationParams } from '../types/api';

export function createPagination(
  totalItems: number,
  { page = 1, limit = 10 }: PaginationParams
): PaginationInfo {
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    currentPage: page,
    pageSize: limit,
    totalItems,
    totalPages,
  };
}

export function createApiResponse<T>(
  data: T,
  statusCode: number = 200,
  pagination?: PaginationInfo,
  message?: string
): ApiResponse<T> {
  return {
    statusCode,
    data,
    ...(pagination && { pagination }),
    ...(message && { message })
  };
} 