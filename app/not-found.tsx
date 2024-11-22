import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
      <div className="relative z-10 text-center px-6">
        <h1 className="text-[150px] font-black text-white leading-none animate-pulse">
          404
        </h1>
        <h2 className="mt-4 text-3xl font-bold text-white/90 tracking-wide">
          Không tìm thấy trang
        </h2>
        <p className="mt-4 text-lg text-white/70 max-w-md mx-auto">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-8">
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
