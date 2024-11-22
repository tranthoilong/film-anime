import { Inter } from 'next/font/google'
import '../globals.css'
import Sidebar from '@/components/cms/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CMS Dashboard',
  description: 'Content Management System Dashboard',
}

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} min-h-screen`}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <div className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
            <h1 className="text-xl font-semibold">CMS Dashboard</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
