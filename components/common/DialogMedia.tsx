'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Image, Search, Eye, Trash2 } from 'lucide-react';
import { UploadButton } from '@uploadthing/react';
import { StatusChanger } from '@/components/common/StatusChanger';
import { Status } from '@/lib/types/enumStatus';
import useSWR from 'swr';
import { useToast } from '@/hooks/use-toast';

interface DialogMediaProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (images: {id: string, url: string}[]) => void;
  multiple?: boolean;
}

interface ImageType {
  id: string;
  name: string;
  url: string;
  created_at: string;
  status?: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const DialogMedia: React.FC<DialogMediaProps> = ({
  isOpen,
  onClose,
  onSelect,
  multiple = false
}) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImages, setSelectedImages] = useState<{id: string, url: string}[]>([]);

  const { toast } = useToast();

  const { data, isLoading, mutate } = useSWR<{
    data: ImageType[];
    pagination: { totalPages: number };
  }>(`/api/images?page=${page}&limit=12${searchQuery ? `&search=${searchQuery}` : ''}`, fetcher);

  const images = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const createImage = async (imageData: { url: string; name: string }) => {
    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData)
      });

      if (!response.ok) {
        throw new Error('Failed to create image');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating image:', error);
      throw error;
    }
  };

  const handleImageSelect = (image: {id: string, url: string}) => {
    if (multiple) {
      setSelectedImages(prev => 
        prev.some(img => img.id === image.id)
          ? prev.filter(img => img.id !== image.id)
          : [...prev, image]
      );
    } else {
      setSelectedImages([image]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedImages);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Quản lý ảnh</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload">
          <TabsList>
            <TabsTrigger value="upload">Tải lên</TabsTrigger>
            <TabsTrigger value="select">Chọn ảnh</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={async (res: { url: string; name: string }[]) => {
                const imageData = {
                  url: res[0].url,
                  name: res[0].name
                };
                
                try {
                  await createImage(imageData);
                  mutate();
                  toast({
                    title: "Thành công",
                    description: "Tải lên ảnh thành công"
                  });
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                  toast({
                    title: "Lỗi",
                    description: "Không thể lưu thông tin ảnh",
                    variant: "destructive"
                  });
                }
              }}
              onUploadError={(error: Error) => {
                toast({
                  title: "Lỗi",
                  description: error.message,
                  variant: "destructive"
                });
              }}
            />
          </TabsContent>

          <TabsContent value="select">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading your first image.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[400px] overflow-y-auto p-4">
                {images.map((image) => (
                  <div 
                    key={image.id} 
                    className={`group relative bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer
                      ${selectedImages.some(img => img.id === image.id) ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => handleImageSelect({id: image.id, url: image.url})}
                  >
                    <div className="aspect-w-3 aspect-h-2">
                      <img 
                        src={image.url} 
                        alt={image.name || "Image"} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col text-white">
                          <span className="text-sm font-medium truncate mb-1">{image.name}</span>
                          <div className="flex items-center justify-between">
                            <div className="text-white text-sm truncate flex-1">
                              {new Date(image.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(image.url, '_blank');
                                }}
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-white/20"
                                title="View image"
                              >
                                <Eye className="h-4 w-4 text-white hover:text-blue-200" />
                              </Button>
                              <StatusChanger 
                                id={image.id}
                                status={Status.DELETED}
                                table="images"
                                onSuccess={() => mutate()}
                                icon={<Trash2 className="h-4 w-4 text-red-500" />}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex items-center justify-center space-x-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleConfirm}>
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
