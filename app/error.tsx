"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
      <div className="relative z-10 text-center px-6">
        <h1 className="text-[150px] font-black text-white leading-none animate-pulse">
          500
        </h1>
        <h2 className="mt-4 text-3xl font-bold text-white/90 tracking-wide">
          Đã xảy ra lỗi
        </h2>
        <p className="mt-4 text-lg text-white/70 max-w-md mx-auto">
          Rất tiếc, đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.
        </p>
        <div className="mt-8 space-x-4">
          <button
            onClick={reset}
            className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg hover:shadow-white/20"
          >
            Thử lại
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg hover:shadow-white/20"
          >
            <span className="mr-2">←</span>
            Về trang chủ
          </Link>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
  );
}
