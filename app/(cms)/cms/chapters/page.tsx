'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Status } from "@/lib/types/enumStatus";
import { StatusChanger } from "@/components/common/StatusChanger";
import { SelectFilterDataTable } from '@/components/common/SelectFilterDataTable';
import { DataTable } from '@/components/common/DataTable';
import { DataTablePagination } from '@/components/common/DataTablePagination';

interface Chapter {
  id: string;
  movie_id: string;
  chapter_number: number;
  title: string;
  slug: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
  movie_title: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<string>("10");

  const fetchChapters = async (page = 1, searchTerm = '', status = 'all') => {
    try {
      setLoading(true);
      const statusQuery = status !== 'all' ? `&status=${status}` : '';
      const response = await fetch(
        `/api/chapters?page=${page}&limit=${limit}&search=${searchTerm}${statusQuery}`
      );
      const data = await response.json();
      
      if (data.statusCode === 200) {
        setChapters(data.data.data);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách chương:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters(1, search, statusFilter);
  }, [search, statusFilter, limit]);

  const handlePageChange = (page: number) => {
    fetchChapters(page, search, statusFilter);
  };

  const handleStatusChange = async (chapterId: string) => {
    await fetchChapters(pagination.currentPage, search, statusFilter);
  };

  const columns = [
    {
      header: "Chương",
      accessor: (chapter: Chapter) => (
        <div>
          <div className="font-medium hover:text-primary cursor-pointer">Chương {chapter.chapter_number}</div>
          <div className="text-sm text-muted-foreground">{chapter.title}</div>
        </div>
      )
    },
    {
      header: "Phim",
      accessor: (chapter: Chapter) => chapter.movie_title
    },
    {
      header: "Ngày Tạo",
      accessor: (chapter: Chapter) => new Date(chapter.created_at).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    {
      header: "Trạng Thái",
      accessor: (chapter: Chapter) => (
        <Badge variant={chapter.status === 1 ? "default" : "destructive"} className="font-medium">
          {chapter.status === 1 ? 'Hoạt Động' : 'Không Hoạt Động'}
        </Badge>
      )
    },
    {
      header: "Thao Tác",
      accessor: (chapter: Chapter) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
            <Link href={`/cms/chapters/${chapter.id}`}>
              <Pencil className="w-4 h-4" />
            </Link>
          </Button>
          <StatusChanger 
            id={chapter.id}
            status={Status.DELETED}
            table="chapters"
            onSuccess={() => handleStatusChange(chapter.id)}
            icon={<Trash2 className="w-4 h-4 text-destructive" />}
          />
        </div>
      ),
      className: "text-right"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Danh Sách Chương</h1>
        <Button asChild>
          <Link href="/cms/chapters/create" className="hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Thêm Chương Mới
          </Link>
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm chương..."
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
            value={limit}
            onValueChange={setLimit}
            data={[
              { id: "10", name: "10 mục" },
              { id: "20", name: "20 mục" },
              { id: "50", name: "50 mục" }
            ]}
            placeholder="Số mục"
            hasAll={false}
            width="120px"
          />
        </div>

        <DataTable
          data={chapters}
          columns={columns}
          loading={loading}
        />

        <DataTablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </Card>
    </div>
  );
}
