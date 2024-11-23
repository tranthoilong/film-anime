'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Film, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function CreateMoviePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    release_year: "",
    duration: "",
    rating: "",
    thumbnail: "",
    video_url: "",
    type: "",
    status: 1
  });

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
        router.push("/cms/movies");
      } else {
        throw new Error("Không thể tạo phim mới");
      }
    } catch (error) {
      console.error("Lỗi khi tạo phim:", error);
      alert("Không thể tạo phim. Vui lòng thử lại.");
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
              <label className="text-sm font-medium">Mô Tả</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Năm Phát Hành</label>
                <Input
                  type="number"
                  name="release_year"
                  value={formData.release_year}
                  onChange={handleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Thời Lượng (phút)</label>
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Xếp Hạng</label>
                <Input
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  placeholder="VD: PG-13"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Thể Loại</label>
              <Input
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL Ảnh Thumbnail</label>
              <Input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL Video</label>
              <Input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                required
              />
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
