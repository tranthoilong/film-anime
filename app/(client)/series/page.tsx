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

// Mock data for TV series
const trendingSeriesData = [
  {
    id: 1,
    title: "Stranger Things",
    image: "/images/series/stranger-things.jpg",
    year: "2016-Present",
    genre: "Sci-Fi & Horror", 
    rating: 8.7,
    seasons: 4,
    video: "/videos/stranger-things-trailer.mp4"
  },
  {
    id: 2, 
    title: "Breaking Bad",
    image: "/images/series/breaking-bad.jpg",
    year: "2008-2013",
    genre: "Crime Drama",
    rating: 9.5,
    seasons: 5,
    video: "/videos/breaking-bad-trailer.mp4"
  },
  {
    id: 3,
    title: "Game of Thrones", 
    image: "/images/series/got.jpg",
    year: "2011-2019",
    genre: "Fantasy Drama",
    rating: 9.3,
    seasons: 8,
    video: "/videos/got-trailer.mp4"
  }
];

const newSeriesData = [
  {
    id: 4,
    title: "The Crown",
    image: "/images/series/the-crown.jpg", 
    year: "2016-Present",
    genre: "Historical Drama",
    rating: 8.7,
    seasons: 5,
    video: "/videos/the-crown-trailer.mp4"
  },
  {
    id: 5,
    title: "House of the Dragon",
    image: "/images/series/hotd.jpg",
    year: "2022-Present", 
    genre: "Fantasy Drama",
    rating: 8.5,
    seasons: 1,
    video: "/videos/hotd-trailer.mp4"
  },
  {
    id: 6,
    title: "Andor",
    image: "/images/series/andor.jpg",
    year: "2022-Present",
    genre: "Sci-Fi Action",
    rating: 8.4,
    seasons: 1,
    video: "/videos/andor-trailer.mp4"
  }
];

const topRatedSeriesData = [
  {
    id: 7,
    title: "Breaking Bad",
    image: "/images/series/breaking-bad.jpg",
    year: "2008-2013",
    genre: "Crime Drama",
    rating: 9.5,
    seasons: 5,
    video: "/videos/breaking-bad-trailer.mp4"
  },
  {
    id: 8,
    title: "The Wire",
    image: "/images/series/the-wire.jpg",
    year: "2002-2008",
    genre: "Crime Drama", 
    rating: 9.3,
    seasons: 5,
    video: "/videos/the-wire-trailer.mp4"
  },
  {
    id: 9,
    title: "Band of Brothers",
    image: "/images/series/band-of-brothers.jpg",
    year: "2001",
    genre: "War Drama",
    rating: 9.4,
    seasons: 1,
    video: "/videos/band-of-brothers-trailer.mp4"
  }
];

export default function SeriesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">TV Series</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Select>
            <SelectTrigger className="w-[140px] bg-gray-800 text-white border-white/10">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white">
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[140px] bg-gray-800 text-white border-white/10">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white">
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[140px] bg-gray-800 text-white border-white/10">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white">
              <SelectItem value="9+">9+</SelectItem>
              <SelectItem value="8+">8+</SelectItem>
              <SelectItem value="7+">7+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Series Sections */}
        <div className="space-y-8">
          {/* Trending */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Trending</h2>
              <Link href="/series/trending" className="text-blue-500 hover:text-blue-400 text-sm">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {trendingSeriesData.map((series) => (
                <Link
                  key={series.id}
                  href={`/app/(client)/series/${series.id}`}
                  className="group bg-white/5 rounded-lg overflow-hidden hover:bg-white/10"
                >
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={series.image}
                      alt={series.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-white line-clamp-1">
                      {series.title}
                    </h3>
                    <p className="text-white/60 text-xs mt-1">
                      {series.year} • {series.genre}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-white/80 text-xs ml-1">{series.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* New Series */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">New Series</h2>
              <Link href="/series/new" className="text-blue-500 hover:text-blue-400 text-sm">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {newSeriesData.map((series) => (
                <Link
                  key={series.id}
                  href={`/app/(client)/series/${series.id}`}
                  className="group bg-white/5 rounded-lg overflow-hidden hover:bg-white/10"
                >
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={series.image}
                      alt={series.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-white line-clamp-1">
                      {series.title}
                    </h3>
                    <p className="text-white/60 text-xs mt-1">
                      {series.year} • {series.genre}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-white/80 text-xs ml-1">{series.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Top Rated */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Top Rated</h2>
              <Link href="/series/top-rated" className="text-blue-500 hover:text-blue-400 text-sm">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {topRatedSeriesData.map((series) => (
                <Link
                  key={series.id}
                  href={`/app/(client)/series/${series.id}`}
                  className="group bg-white/5 rounded-lg overflow-hidden hover:bg-white/10"
                >
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={series.image}
                      alt={series.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-white line-clamp-1">
                      {series.title}
                    </h3>
                    <p className="text-white/60 text-xs mt-1">
                      {series.year} • {series.genre}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-white/80 text-xs ml-1">{series.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
