"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

interface Movie {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  genre: string;
  year: number;
  rating: number;
}

export default function MoviePage({ params }: { params: { slug: string } }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedSlug = use(params).slug;
  // useEffect(() => {
  //   const fetchMovie = async () => {
  //     try {
  //       // // Giả lập API call
  //       // const mockMovie: Movie = {
  //       //   id: "1",
  //       //   title: "Phim mẫu",
  //       //   description: "Mô tả chi tiết về bộ phim...",
  //       //   videoUrl: "https://example.com/video.mp4",
  //       //   thumbnailUrl: "https://example.com/thumbnail.jpg",
  //       //   genre: "Hành động",
  //       //   year: 2023,
  //       //   rating: 4.5
  //       // };
        
  //       // setMovie(mockMovie);
  //     } catch (err) {
  //       setError("Không thể tải thông tin phim. Vui lòng thử lại sau.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchMovie();
  // }, [params.slug]);

  console.log(resolvedSlug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
          <Link 
            href="/public"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy phim</h1>
          <Link 
            href="/public"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="aspect-video bg-black mb-8">
          {/* Video player sẽ được thêm vào đây */}
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500">Video Player</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.genre}</span>
            <span>•</span>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1">{movie.rating}/5</span>
            </div>
          </div>

          <p className="text-gray-300 mb-8">{movie.description}</p>

          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Phát
            </button>
            <button className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              Thêm vào danh sách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
