"use client";

import Link from "next/link";
import { Search, Bell, Menu, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY === 0) {
        // At the top of the page
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              MovieStream
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/movies" className="text-white/80 hover:text-white transition-colors">
              Movies
            </Link>
            <Link href="/series" className="text-white/80 hover:text-white transition-colors">
              TV Series
            </Link>
            <Link href="/new" className="text-white/80 hover:text-white transition-colors">
              New Releases
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5 text-white/80" />
              </button>
              {isSearchOpen && (
                <div className="md:absolute md:right-0 md:top-12 md:w-72 fixed left-0 right-0 top-20 mx-4 md:mx-0 bg-black/90 rounded-lg p-4 shadow-lg border border-white/10">
                  <input
                    type="text"
                    placeholder="Search movies, series..."
                    className="w-full bg-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="w-5 h-5 text-white/80" />
              </button>
              {isNotificationsOpen && (
                <div className="md:absolute md:right-0 md:top-12 md:w-80 fixed left-0 right-0 top-20 mx-4 md:mx-0 bg-black/90 rounded-lg shadow-lg divide-y divide-white/10 border border-white/10">
                  <div className="p-4 flex justify-between items-center">
                    <h3 className="text-white font-semibold">Notifications</h3>
                    <button 
                      className="text-white/60 hover:text-white text-sm"
                      onClick={() => {
                        // Add clear notifications logic here
                      }}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-[calc(100vh-12rem)] md:max-h-96 overflow-y-auto">
                    <div className="p-4 hover:bg-white/5 cursor-pointer group">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white/80 text-sm">New movie "The Matrix Resurrections" is now available</p>
                          <span className="text-white/60 text-xs mt-1">2 hours ago</span>
                        </div>
                        <button className="text-white/60 hover:text-white opacity-0 group-hover:opacity-100">
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-white/5 cursor-pointer group">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white/80 text-sm">Continue watching "Inception" where you left off</p>
                          <span className="text-white/60 text-xs mt-1">5 hours ago</span>
                        </div>
                        <button className="text-white/60 hover:text-white opacity-0 group-hover:opacity-100">
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-white/5 cursor-pointer group">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white/80 text-sm">New episode of "Stranger Things" is available</p>
                          <span className="text-white/60 text-xs mt-1">1 day ago</span>
                        </div>
                        <button className="text-white/60 hover:text-white opacity-0 group-hover:opacity-100">
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <User className="w-5 h-5 text-white/80" />
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/movies" 
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </Link>
              <Link 
                href="/series" 
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                TV Series
              </Link>
              <Link 
                href="/new" 
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                New Releases
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
