'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import movieTypes from '@/lib/configs/config.json';
import slugify from 'slugify';

export default function CreateMoviePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    release_year: "",
    duration: "",
    type: "",
    status: 1
  });

  useEffect(() => {
    // Generate slug when title changes
    const slug = slugify(formData.title, {
      lower: true,
      strict: true,
      locale: 'vi'
    });
    setFormData(prev => ({
      ...prev,
      slug
    }));
  }, [formData.title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Tạo phim mới thành công",
        });
        router.push("/cms/movies");
      } else {
        throw new Error("Không thể tạo phim mới");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo phim. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate years from 1900 to current year
  const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i).reverse();
  
  // Generate durations from 1 to 300 minutes
  const durations = Array.from({ length: 300 }, (_, i) => i + 1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            <h1 className="text-3xl font-bold tracking-tight">Thêm Phim Mới</h1>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên Phim</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <Input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mô Tả Ngắn</label>
              <Textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mô Tả</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Năm Phát Hành</label>
                <Select
                  name="release_year"
                  value={formData.release_year}
                  onValueChange={(value) => handleSelectChange("release_year", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn năm" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Thời Lượng (phút)</label>
                <Select
                  name="duration"
                  value={formData.duration}
                  onValueChange={(value) => handleSelectChange("duration", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn số phút" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} phút
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Thể Loại</label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thể loại" />
                </SelectTrigger>
                <SelectContent>
                  {movieTypes.movieTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo Phim"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
