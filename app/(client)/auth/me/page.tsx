"use client";

import { useGetMe } from "@/hooks/useGetMe";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, loading } = useGetMe();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg text-white/80 mb-2">Email</h2>
              <p className="text-white">{user.email}</p>
            </div>

            <div>
              <h2 className="text-lg text-white/80 mb-2">Account Created</h2>
              <p className="text-white">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="pt-6 border-t border-gray-700">
              <h2 className="text-lg text-white/80 mb-4">Account Settings</h2>
              <div className="space-y-4">
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  onClick={() => router.push('/auth/change-password')}
                >
                  Change Password
                </button>
                
                <button 
                  className="block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  onClick={() => {
                    // Add delete account logic here
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      // Handle account deletion
                    }
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
