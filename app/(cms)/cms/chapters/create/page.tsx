'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import slugify from 'slugify';
import { SelectData } from '@/components/common/SelectData';

const chapterSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  chapter_number: z.string().min(1, "Số chương không được để trống"),
  movie_id: z.string().min(1, "ID phim không được để trống"), 
  description: z.string().min(1, "Nội dung không được để trống"),
  status: z.string()
});

export default function CreateChapterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    chapter_number: '',
    movie_id: '',
    description: '',
    status: '1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validatedData = chapterSchema.parse(formData);

      const response = await fetch('/api/chapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/cms/chapters');
      } else {
        setErrors(prev => ({
          ...prev,
          chapter_number: data.message || 'Có lỗi xảy ra khi tạo chương mới'
        }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = {
        ...prev,
        [name]: value
      };
      
      // Auto-generate slug when title changes
      if (name === 'title') {
        updates.slug = slugify(value, {
          lower: true,
          strict: true,
          locale: 'vi'
        });
      }
      
      return updates;
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Thêm Chương Mới</h1>

      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề chương"
              required
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <Input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Slug sẽ được tự động tạo"
              required
            />
            {errors.slug && (
              <p className="text-sm text-red-500 mt-1">{errors.slug}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Số chương</label>
            <Input
              name="chapter_number"
              type="number"
              value={formData.chapter_number}
              onChange={handleChange}
              placeholder="Nhập số chương"
              required
            />
            {errors.chapter_number && (
              <p className="text-sm text-red-500 mt-1">{errors.chapter_number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ID Phim</label>
            <SelectData
              endpoint="/api/movies/get-data-select"
              onSelect={(value: string) => setFormData(prev => ({ ...prev, movie_id: value }))}
              placeholder="Chọn phim"
            />
            {errors.movie_id && (
              <p className="text-sm text-red-500 mt-1">{errors.movie_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nội dung</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập nội dung chương"
              className="w-full min-h-[200px] p-2 border rounded-md"
              required
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <Select 
              defaultValue={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Hoạt động</SelectItem>
                <SelectItem value="0">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">{errors.status}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Thêm mới
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/cms/chapters')}
            >
              Hủy
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
