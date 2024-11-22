import { Inter } from 'next/font/google'
import Header from '@/components/common/header'
import '../globals.css'
import Footer from "@/components/common/footer";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Anime Film',
  description: 'Watch anime films and series online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
       <Header/>
      {children}
      <Footer/>
      </>
  )
}
