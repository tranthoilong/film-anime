"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Film, Tv, Users, BarChart, Image, BookOpen, MessageSquare, Eye, Settings, FileText } from "lucide-react";

export default function Sidebar() {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  const menuItems = [
    {
      name: "Dashboard",
      icon: <BarChart className="w-5 h-5" />,
      path: "/cms",
      id: "dashboard"
    },
    {
      name: "Movies",
      icon: <Film className="w-5 h-5" />,
      path: "/cms/movies",
      id: "movies"
    },
    {
      name: "TV Shows", 
      icon: <Tv className="w-5 h-5" />,
      path: "/cms/tv-shows",
      id: "tv-shows"
    },
    {
      name: "Chapters",
      icon: <BookOpen className="w-5 h-5" />,
      path: "/cms/chapters",
      id: "chapters"
    },
    {
      name: "Episodes",
      icon: <FileText className="w-5 h-5" />,
      path: "/cms/episodes",
      id: "episodes"
    },
    {
      name: "Comments",
      icon: <MessageSquare className="w-5 h-5" />,
      path: "/cms/comments",
      id: "comments"
    },
    {
      name: "Views",
      icon: <Eye className="w-5 h-5" />,
      path: "/cms/views",
      id: "views"
    },
    {
      name: "Users",
      icon: <Users className="w-5 h-5" />,
      path: "/cms/users", 
      id: "users"
    },
    {
      name: "Media",
      icon: <Image className="w-5 h-5" />,
      path: "/cms/media",
      id: "images"
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/cms/settings",
      id: "settings"
    }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200">
      <div className="p-4">
        <h1 className="text-xl font-bold">CMS Dashboard</h1>
      </div>
      
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.path}
            onClick={() => setSelectedMenu(item.id)}
            className={`flex items-center px-4 py-3 text-sm hover:bg-gray-100 ${
              selectedMenu === item.id 
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.name}</span>
            <ChevronRight className={`w-4 h-4 ml-auto ${
              selectedMenu === item.id ? "text-blue-600" : "text-gray-400"
            }`} />
          </Link>
        ))}
      </nav>
    </div>
  );
}
