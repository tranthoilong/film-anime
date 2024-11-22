"use client";

import { useState } from "react";
import { Play, Info, Star, Clock, Calendar, List, Download, Share2, Heart } from "lucide-react";

export default function MoviePage() {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [commentText, setCommentText] = useState("");

  const episodes = [
    { number: 1, title: "Episode 1", duration: "45m" },
    { number: 2, title: "Episode 2", duration: "42m" },
    { number: 3, title: "Episode 3", duration: "44m" },
    { number: 4, title: "Episode 4", duration: "46m" }
  ];

  const genres = ["Action", "Drama", "Thriller"];

  const comments = [
    {
      id: 1,
      user: "John Doe",
      avatar: "/avatars/user1.jpg",
      content: "This movie was absolutely amazing! The plot twists kept me on the edge of my seat the entire time.",
      timestamp: "2 hours ago",
      likes: 24
    },
    {
      id: 2,
      user: "Sarah Smith",
      avatar: "/avatars/user2.jpg",
      content: "The acting was superb, especially in the emotional scenes. Definitely deserves all the awards it's getting.",
      timestamp: "5 hours ago",
      likes: 18
    },
    {
      id: 3,
      user: "Mike Johnson",
      avatar: "/avatars/user3.jpg",
      content: "The cinematography and special effects were breathtaking. A must-watch for any film enthusiast!",
      timestamp: "1 day ago",
      likes: 42
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-3/4">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <div style={{position:"relative", paddingBottom:"56.25%", height:0, overflow:"hidden"}}>
                <iframe style={{width:"100%", height:"100%", position:"absolute", left:0, top:0, overflow:"hidden", border:"none"}} src="https://short.ink/CGEaMPQCmJ" frameBorder="0" scrolling="0" allowFullScreen></iframe>
              </div>
            </div>

            <div className="mt-3 flex justify-center gap-2">
              <button className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm">
                <span className="font-medium text-sm">Server 1</span>
              </button>
              <button className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm">
                <span className="font-medium text-sm">Server 2</span>
              </button>
              <button className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm">
                <span className="font-medium text-sm">Server 3</span>
              </button>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between items-center">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Movie Title</h1>
                <div className="flex gap-4">
                  <button onClick={() => setIsFavorite(!isFavorite)} className={`p-3 rounded-full ${isFavorite ? 'bg-pink-500' : 'bg-white/10'} transition-all duration-300`}>
                    <Heart size={24} className={isFavorite ? 'text-white fill-current' : 'text-white'} />
                  </button>
                  <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                    <Share2 size={24} />
                  </button>
                  <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                    <Download size={24} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {genres.map((genre, index) => (
                  <span key={index} className="px-4 py-1 rounded-full bg-white/5 text-sm font-medium">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-6 text-sm font-medium">
                <span className="flex items-center gap-2 bg-yellow-400/10 px-4 py-2 rounded-full">
                  <Star className="text-yellow-400" size={18} /> 
                  <span className="text-yellow-100">4.8/5</span>
                </span>
                <span className="flex items-center gap-2 bg-blue-400/10 px-4 py-2 rounded-full">
                  <Clock size={18} className="text-blue-400" />
                  <span className="text-blue-100">2h 15m</span>
                </span>
                <span className="flex items-center gap-2 bg-purple-400/10 px-4 py-2 rounded-full">
                  <Calendar size={18} className="text-purple-400" />
                  <span className="text-purple-100">2023</span>
                </span>
              </div>

              {/* <div className="flex items-center gap-6 mt-8">
                <button className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/25 font-medium">
                  <Play size={22} />
                  Play Now
                </button>
                <button className="flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg font-medium">
                  <Info size={22} />
                  More Info
                </button>
              </div> */}

              <div className="mt-8">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <List size={28} className="text-blue-400" />
                  Episodes
                </h2>
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                  {episodes.map((episode) => (
                    <button
                      key={episode.number}
                      onClick={() => setSelectedEpisode(episode.number)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedEpisode === episode.number
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white/80"
                      }`}
                    >
                      Tập {episode.number}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/4">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Related Movies</h2>
            <div className="space-y-8">
              {[1, 2, 3].map((item) => (
                <div 
                  key={item}
                  className="relative rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl ring-1 ring-white/10"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <img
                    src={`/movie-thumbnail-${item}.jpg`}
                    alt={`Related Movie ${item}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-center justify-center transition-all duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                      <Play className="text-white" size={36} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <h3 className="text-white font-semibold text-lg">Related Movie {item}</h3>
                    <p className="text-gray-300 text-sm mt-1">2023 • Action, Drama</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">About the Movie</h2>
          <p className="text-gray-200 leading-relaxed backdrop-blur-sm bg-white/5 p-8 rounded-2xl shadow-xl ring-1 ring-white/10 text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Comments</h2>
          <div className="backdrop-blur-sm bg-white/5 p-8 rounded-2xl shadow-xl ring-1 ring-white/10">
            <textarea 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..." 
              className="w-full bg-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300">
              Post Comment
            </button>

            <div className="mt-8 space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <img 
                    src={comment.avatar} 
                    alt={comment.user}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{comment.user}</h4>
                      <span className="text-sm text-gray-400">{comment.timestamp}</span>
                    </div>
                    <p className="mt-2 text-gray-200">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400">
                        <Heart size={16} />
                        {comment.likes}
                      </button>
                      <button className="text-sm text-gray-400 hover:text-blue-400">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}