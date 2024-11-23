'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import { Status } from "@/lib/types/enumStatus";
import { StatusChanger } from "@/components/common/StatusChanger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { movieTypes } from '@/lib/configs/config.json';
import { SelectFilterDataTable } from '@/components/common/SelectFilterDataTable';

interface Movie {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  release_year: number;
  duration: number;
  type: string;
  view_count: number;
  unique_viewers: number;
  status: number;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  image_name: string | null;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchMovies = async (page = 1, searchTerm = '', status = 'all', type = 'all') => {
    try {
      setLoading(true);
      const statusQuery = status !== 'all' ? `&status=${status}` : '';
      const typeQuery = type !== 'all' ? `&type=${type}` : '';
      const response = await fetch(
        `/api/movies?page=${page}&limit=${pagination.pageSize}&search=${searchTerm}${statusQuery}${typeQuery}`
      );
      const data = await response.json();
      
      if (data.statusCode === 200) {
        setMovies(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách phim:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1, search, statusFilter, typeFilter);
  }, [search, statusFilter, typeFilter]);

  const handlePageChange = (page: number) => {
    fetchMovies(page, search, statusFilter, typeFilter);
  };

  const handleStatusChange = async (movieId: string) => {
    await fetchMovies(pagination.currentPage, search, statusFilter, typeFilter);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Danh Sách Phim</h1>
        <Button asChild>
          <Link href="/cms/movies/create" className="hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Thêm Phim Mới
          </Link>
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm phim..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 max-w-sm"
            />
          </div>
          
          <SelectFilterDataTable
            value={statusFilter}
            onValueChange={setStatusFilter}
            data={[
              { id: "1", name: "Hoạt động" },
              { id: "0", name: "Không hoạt động" }
            ]}
            placeholder="Trạng thái"
            width="180px"
          />

          <SelectFilterDataTable
            value={typeFilter}
            onValueChange={setTypeFilter}
            data={movieTypes}
            placeholder="Thể loại"
            width="180px"
          />

          <SelectFilterDataTable
            value="10"
            onValueChange={(value) => setPagination(prev => ({...prev, pageSize: Number(value)}))}
            data={[
              { id: "10", name: "10 mục" },
              { id: "20", name: "20 mục" }, 
              { id: "50", name: "50 mục" }
            ]}
            placeholder="Số mục"
            width="120px"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Tên Phim</TableHead>
                    <TableHead>Năm Phát Hành</TableHead>
                    <TableHead>Thời Lượng</TableHead>
                    <TableHead>Thể Loại</TableHead>
                    <TableHead>Lượt Xem</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies.map((movie) => (
                    <TableRow key={movie.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex gap-4">
                          {movie.image_url ? (
                            <Image 
                              src={movie.image_url}
                              alt={movie.title}
                              width={80}
                              height={120}
                              className="object-cover rounded shadow-sm"
                            />
                          ) : (
                            <div className="w-[80px] h-[120px] bg-muted rounded flex items-center justify-center">
                              <span className="text-muted-foreground">No image</span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium hover:text-primary cursor-pointer">{movie.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">{movie.short_description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{movie.release_year}</TableCell>
                      <TableCell>{movie.duration} phút</TableCell>
                      <TableCell>
                        {movieTypes.find(type => type.id === movie.type)?.name || movie.type}
                      </TableCell>
                      <TableCell>{movie.view_count.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={movie.status === 1 ? "default" : "destructive"} className="font-medium">
                          {movie.status === 1 ? 'Hoạt Động' : 'Không Hoạt Động'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                            <Link href={`/cms/movies/${movie.id}`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>
                          <StatusChanger 
                            id={movie.id}
                            status={Status.DELETED}
                            table="movies"
                            onSuccess={() => handleStatusChange(movie.id)}
                            icon={<Trash2 className="w-4 h-4 text-destructive" />}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                Hiển thị {(pagination.currentPage - 1) * pagination.pageSize + 1} đến{' '}
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} trong tổng số{' '}
                {pagination.totalItems} kết quả
              </div>
              
              <Pagination>
                <PaginationContent>
                  {pagination.currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={() => handlePageChange(pagination.currentPage - 1)} 
                      />
                    </PaginationItem>
                  )}

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={() => handlePageChange(page)}
                            isActive={page === pagination.currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === pagination.currentPage - 2 ||
                      page === pagination.currentPage + 2
                    ) {
                      return <PaginationEllipsis key={page} />;
                    }
                    return null;
                  })}

                  {pagination.currentPage < pagination.totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={() => handlePageChange(pagination.currentPage + 1)} 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
