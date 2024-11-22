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
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

export default function MoviesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mock data - in a real app this would come from an API
  const movies = [
    {
      id: 1,
      title: "The Dark Knight",
      image: "/Ning_Yao_1.jfif",
      year: 2008,
      rating: 9.0,
      genre: "Action, Crime, Drama"
    },
    {
      id: 2,
      title: "Inception",
      image: "/Ning_Yao_1.jfif", 
      year: 2010,
      rating: 8.8,
      genre: "Action, Adventure, Sci-Fi"
    },
    {
      id: 3,
      title: "Interstellar",
      image: "/Ning_Yao_1.jfif",
      year: 2014, 
      rating: 8.6,
      genre: "Adventure, Drama, Sci-Fi"
    },
    {
      id: 4,
      title: "The Shawshank Redemption",
      image: "/Ning_Yao_1.jfif",
      year: 1994,
      rating: 9.3,
      genre: "Drama"
    },
    {
      id: 5,
      title: "Pulp Fiction",
      image: "/Ning_Yao_1.jfif",
      year: 1994,
      rating: 8.9,
      genre: "Crime, Drama"
    },
    {
      id: 6,
      title: "The Matrix",
      image: "/Ning_Yao_1.jfif",
      year: 1999,
      rating: 8.7,
      genre: "Action, Sci-Fi"
    },
    {
      id: 7,
      title: "Forrest Gump",
      image: "/Ning_Yao_1.jfif",
      year: 1994,
      rating: 8.8,
      genre: "Drama, Romance"
    },
    {
      id: 8,
      title: "Fight Club",
      image: "/Ning_Yao_1.jfif",
      year: 1999,
      rating: 8.8,
      genre: "Drama"
    },
    {
      id: 9,
      title: "The Godfather",
      image: "/Ning_Yao_1.jfif",
      year: 1972,
      rating: 9.2,
      genre: "Crime, Drama"
    },
    {
      id: 10,
      title: "Goodfellas",
      image: "/Ning_Yao_1.jfif",
      year: 1990,
      rating: 8.7,
      genre: "Biography, Crime, Drama"
    },
    {
      id: 11,
      title: "The Silence of the Lambs",
      image: "/Ning_Yao_1.jfif",
      year: 1991,
      rating: 8.6,
      genre: "Crime, Drama, Thriller"
    },
    {
      id: 12,
      title: "Schindler's List",
      image: "/Ning_Yao_1.jfif",
      year: 1993,
      rating: 9.0,
      genre: "Biography, Drama, History"
    },
    {
      id: 13,
      title: "The Lord of the Rings",
      image: "/Ning_Yao_1.jfif",
      year: 2001,
      rating: 8.9,
      genre: "Adventure, Fantasy"
    },
    {
      id: 14,
      title: "Gladiator",
      image: "/Ning_Yao_1.jfif",
      year: 2000,
      rating: 8.5,
      genre: "Action, Drama"
    },
    {
      id: 15,
      title: "Saving Private Ryan",
      image: "/Ning_Yao_1.jfif",
      year: 1998,
      rating: 8.6,
      genre: "Drama, War"
    },
    {
      id: 16,
      title: "The Green Mile",
      image: "/Ning_Yao_1.jfif",
      year: 1999,
      rating: 8.6,
      genre: "Crime, Drama, Fantasy"
    },
    {
      id: 17,
      title: "Jurassic Park",
      image: "/Ning_Yao_1.jfif",
      year: 1993,
      rating: 8.2,
      genre: "Adventure, Sci-Fi"
    },
    {
      id: 18,
      title: "The Departed",
      image: "/Ning_Yao_1.jfif",
      year: 2006,
      rating: 8.5,
      genre: "Crime, Drama, Thriller"
    },
    {
      id: 19,
      title: "Titanic",
      image: "/Ning_Yao_1.jfif",
      year: 1997,
      rating: 7.9,
      genre: "Drama, Romance"
    },
    {
      id: 20,
      title: "The Usual Suspects",
      image: "/Ning_Yao_1.jfif",
      year: 1995,
      rating: 8.5,
      genre: "Crime, Mystery, Thriller"
    },
    {
      id: 21,
      title: "Memento",
      image: "/Ning_Yao_1.jfif",
      year: 2000,
      rating: 8.4,
      genre: "Mystery, Thriller"
    },
    {
      id: 22,
      title: "American Beauty",
      image: "/Ning_Yao_1.jfif",
      year: 1999,
      rating: 8.3,
      genre: "Drama"
    },
    {
      id: 23,
      title: "The Sixth Sense",
      image: "/Ning_Yao_1.jfif",
      year: 1999,
      rating: 8.2,
      genre: "Drama, Mystery, Thriller"
    },
    {
      id: 24,
      title: "Good Will Hunting",
      image: "/Ning_Yao_1.jfif",
      year: 1997,
      rating: 8.3,
      genre: "Drama, Romance"
    },
    {
      id: 25,
      title: "The Avengers",
      image: "/Ning_Yao_1.jfif",
      year: 2012,
      rating: 8.0,
      genre: "Action, Adventure, Sci-Fi"
    },
    {
      id: 26,
      title: "Avatar",
      image: "/Ning_Yao_1.jfif",
      year: 2009,
      rating: 7.8,
      genre: "Action, Adventure, Fantasy"
    },
    {
      id: 27,
      title: "The Social Network",
      image: "/Ning_Yao_1.jfif",
      year: 2010,
      rating: 7.7,
      genre: "Biography, Drama"
    },
    {
      id: 28,
      title: "La La Land",
      image: "/Ning_Yao_1.jfif",
      year: 2016,
      rating: 8.0,
      genre: "Comedy, Drama, Music"
    },
    {
      id: 29,
      title: "The Grand Budapest Hotel",
      image: "/Ning_Yao_1.jfif",
      year: 2014,
      rating: 8.1,
      genre: "Adventure, Comedy, Crime"
    },
    {
      id: 30,
      title: "Black Swan",
      image: "/Ning_Yao_1.jfif",
      year: 2010,
      rating: 8.0,
      genre: "Drama, Thriller"
    },
    {
      id: 31,
      title: "The Wolf of Wall Street",
      image: "/Ning_Yao_1.jfif",
      year: 2013,
      rating: 8.2,
      genre: "Biography, Comedy, Crime"
    },
    {
      id: 32,
      title: "Gone Girl",
      image: "/Ning_Yao_1.jfif",
      year: 2014,
      rating: 8.1,
      genre: "Drama, Mystery, Thriller"
    },
    {
      id: 33,
      title: "Mad Max: Fury Road",
      image: "/Ning_Yao_1.jfif",
      year: 2015,
      rating: 8.1,
      genre: "Action, Adventure, Sci-Fi"
    },
    {
      id: 34,
      title: "Whiplash",
      image: "/Ning_Yao_1.jfif",
      year: 2014,
      rating: 8.5,
      genre: "Drama, Music"
    },
    {
      id: 35,
      title: "The Revenant",
      image: "/Ning_Yao_1.jfif",
      year: 2015,
      rating: 8.0,
      genre: "Action, Adventure, Drama"
    },
    {
      id: 36,
      title: "Moonlight",
      image: "/Ning_Yao_1.jfif",
      year: 2016,
      rating: 7.4,
      genre: "Drama"
    },
    {
      id: 37,
      title: "Get Out",
      image: "/Ning_Yao_1.jfif",
      year: 2017,
      rating: 7.7,
      genre: "Horror, Mystery, Thriller"
    },
    {
      id: 38,
      title: "Dunkirk",
      image: "/Ning_Yao_1.jfif",
      year: 2017,
      rating: 7.8,
      genre: "Action, Drama, History"
    },
    {
      id: 39,
      title: "A Star Is Born",
      image: "/Ning_Yao_1.jfif",
      year: 2018,
      rating: 7.6,
      genre: "Drama, Music, Romance"
    },
    {
      id: 40,
      title: "Parasite",
      image: "/Ning_Yao_1.jfif",
      year: 2019,
      rating: 8.6,
      genre: "Comedy, Drama, Thriller"
    }
  ];

  // Pagination logic
  const moviesPerPage = 12;
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentMovies = movies.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8">Movies</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Select>
            <SelectTrigger className="w-[180px] bg-gradient-to-r from-gray-800 to-gray-900 text-white border-white/10 hover:border-white/20">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-white/10">
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="thriller">Thriller</SelectItem>
              <SelectItem value="horror">Horror</SelectItem>
              <SelectItem value="sci-fi">Sci-Fi</SelectItem>
              <SelectItem value="romance">Romance</SelectItem>
              <SelectItem value="mystery">Mystery</SelectItem>
              <SelectItem value="crime">Crime</SelectItem>
              <SelectItem value="biography">Biography</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px] bg-gradient-to-r from-gray-800 to-gray-900 text-white border-white/10 hover:border-white/20">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-white/10">
              <SelectItem value="2020-present">2020 - Present</SelectItem>
              <SelectItem value="2010-2019">2010 - 2019</SelectItem>
              <SelectItem value="2000-2009">2000 - 2009</SelectItem>
              <SelectItem value="1990-1999">1990 - 1999</SelectItem>
              <SelectItem value="1980-1989">1980 - 1989</SelectItem>
              <SelectItem value="before-1980">Before 1980</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px] bg-gradient-to-r from-gray-800 to-gray-900 text-white border-white/10 hover:border-white/20">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-white/10">
              <SelectItem value="9+">9+ Rating</SelectItem>
              <SelectItem value="8-9">8 - 9 Rating</SelectItem>
              <SelectItem value="7-8">7 - 8 Rating</SelectItem>
              <SelectItem value="6-7">6 - 7 Rating</SelectItem>
              <SelectItem value="high-to-low">Highest to Lowest</SelectItem>
              <SelectItem value="low-to-high">Lowest to Highest</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px] bg-gradient-to-r from-gray-800 to-gray-900 text-white border-white/10 hover:border-white/20">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-white/10">
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="korean">Korean</SelectItem>
              <SelectItem value="japanese">Japanese</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px] bg-gradient-to-r from-gray-800 to-gray-900 text-white border-white/10 hover:border-white/20">
              <SelectValue placeholder="Awards" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-white/10">
              <SelectItem value="oscar">Oscar Winners</SelectItem>
              <SelectItem value="golden-globe">Golden Globe Winners</SelectItem>
              <SelectItem value="bafta">BAFTA Winners</SelectItem>
              <SelectItem value="palme">Palme d'Or Winners</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {currentMovies.map((movie) => (
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
