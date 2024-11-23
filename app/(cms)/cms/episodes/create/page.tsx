'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, ArrowLeft, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import slugify from 'slugify';
import { DialogMedia } from '@/components/common/DialogMedia';
import Image from 'next/image';
import { z } from "zod";
import { SelectData } from '@/components/common/SelectData';

const episodeSchema = z.object({
  movie_id: z.string().min(1, "ID phim không được để trống"),
  chapter_id: z.string(),
  episode_number: z.string().min(1, "Số tập không được để trống"),
  title: z.string(),
  slug: z.string().min(1, "Slug không được để trống"),
  short_description: z.string(),
  description: z.string(),
  duration: z.string(),
  image_id: z.string(),
  video_links: z.array(z.string())
});

export default function CreateEpisodePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{id: string, url: string} | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    movie_id: '',
    chapter_id: '',
    episode_number: '',
    title: '',
    slug: '',
    short_description: '',
    description: '',
    duration: '',
    image_id: '',
    video_links: ['']
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
    setErrors({});

    try {
      const validatedData = episodeSchema.parse(formData);

      const response = await fetch("/api/episodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Tạo tập phim mới thành công",
        });
        router.push("/cms/episodes");
      } else {
        throw new Error("Không thể tạo tập phim mới");
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
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo tập phim. Vui lòng thử lại.",
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageSelect = (images: {id: string, url: string}[]) => {
    if (images.length > 0) {
      const image = images[0];
      setSelectedImage(image);
      setFormData(prev => ({
        ...prev,
        image_id: image.id
      }));
    }
  };

  const handleVideoLinkChange = (index: number, value: string) => {
    const newVideoLinks = [...formData.video_links];
    newVideoLinks[index] = value;
    setFormData({ ...formData, video_links: newVideoLinks });
  };

  const addVideoLink = () => {
    setFormData({
      ...formData,
      video_links: [...formData.video_links, '']
    });
  };

  const removeVideoLink = (index: number) => {
    const newVideoLinks = formData.video_links.filter((_, i) => i !== index);
    setFormData({ ...formData, video_links: newVideoLinks });
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
            <h1 className="text-3xl font-bold tracking-tight">Thêm Tập Phim Mới</h1>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ảnh Thumbnail</label>
              <div className="flex items-center gap-4">
                {selectedImage ? (
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden">
                    <Image
                      src={selectedImage.url}
                      alt="Thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-40 h-40 bg-gray-100 rounded-lg">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setIsMediaDialogOpen(true)}
                >
                  Chọn ảnh
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phim</label>
                <SelectData
                  endpoint="/api/movies/get-data-select"
                  onSelect={(value: string) => setFormData(prev => ({ ...prev, movie_id: value }))}
                  placeholder="Chọn phim"
                />
                {errors.movie_id && <p className="text-sm text-red-500">{errors.movie_id}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Chapter</label>
                <SelectData
                  endpoint="/api/chapters/get-data-select"
                  onSelect={(value: string) => setFormData(prev => ({ ...prev, chapter_id: value }))}
                  placeholder="Chọn chapter"
                />
                {errors.chapter_id && <p className="text-sm text-red-500">{errors.chapter_id}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Số Tập</label>
                <Input
                  name="episode_number"
                  type="number"
                  value={formData.episode_number}
                  onChange={handleChange}
                  required
                />
                {errors.episode_number && <p className="text-sm text-red-500">{errors.episode_number}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Thời Lượng (phút)</label>
                <Input
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                />
                {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tiêu Đề</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
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
              {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mô Tả Ngắn</label>
              <Textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                rows={2}
              />
              {errors.short_description && <p className="text-sm text-red-500">{errors.short_description}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mô Tả Chi Tiết</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Link Video</label>
              {formData.video_links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={link}
                    onChange={(e) => handleVideoLinkChange(index, e.target.value)}
                    placeholder={`Link video ${index + 1}`}
                  />
                  {formData.video_links.length > 1 && (
                    <Button 
                      type="button"
                      variant="destructive"
                      onClick={() => removeVideoLink(index)}
                    >
                      Xóa
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addVideoLink}>
                Thêm Link Video
              </Button>
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
              {isSubmitting ? "Đang tạo..." : "Tạo Tập Phim"}
            </Button>
          </div>
        </form>
      </Card>

      <DialogMedia
        isOpen={isMediaDialogOpen}
        onClose={() => setIsMediaDialogOpen(false)}
        onSelect={handleImageSelect}
        multiple={false}
      />
    </div>
  );
}
