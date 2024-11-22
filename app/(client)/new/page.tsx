"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for new releases
const newReleases = [
  {
    id: 1,
    title: "The Matrix Resurrections",
    image: "/movies/matrix.jpg",
    year: 2023,
    genre: "Action, Sci-Fi",
    rating: 8.2,
    releaseDate: "2023-12-15"
  },
  {
    id: 2, 
    title: "Dune: Part Two",
    image: "/movies/dune.jpg",
    year: 2024,
    genre: "Sci-Fi, Adventure",
    rating: 8.8,
    releaseDate: "2024-03-01"
  },
  // Add more mock data as needed
];

export default function NewReleasesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;
  const totalItems = newReleases.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentReleases = newReleases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">New Releases</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Select>
            <SelectTrigger className="w-[180px] bg-gradient-to-r from-gray-800 to-gray-900 text-white border-white/10 hover:border-white/20">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-white/10">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="rating">Highest Rating</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px] bg-gradient-to-r from-gray-800 to-gray-900 text-white border-white/10 hover:border-white/20">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-white/10">
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="horror">Horror</SelectItem>
              <SelectItem value="scifi">Sci-Fi</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px] bg-gradient-to-r from-gray-800 to-gray-900 text-white border-white/10 hover:border-white/20">
              <SelectValue placeholder="Release Window" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-white/10">
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past 3 Months</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {currentReleases.map((movie) => (
            <Link
              key={movie.id}
              href={`/app/(client)/movies/${movie.id}`}
              className="group relative bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
            >
              <div className="aspect-[2/3] relative">
                <Image
                  src={movie.image}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2 md:p-3">
                <h2 className="text-sm md:text-base font-semibold text-white group-hover:text-white/80 transition-colors line-clamp-1">
                  {movie.title}
                </h2>
                <p className="text-white/60 text-xs md:text-sm mt-0.5 line-clamp-1">
                  {movie.year} • {movie.genre}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className="text-white/80 text-xs md:text-sm ml-1">{movie.rating}</span>
                </div>
                <p className="text-white/60 text-xs mt-1">
                  Released: {movie.releaseDate}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                  className={`bg-white/10 text-white hover:bg-white/20 ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className={currentPage === page
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-white/10 text-white hover:bg-white/20"
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                  className={`bg-white/10 text-white hover:bg-white/20 ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
}
