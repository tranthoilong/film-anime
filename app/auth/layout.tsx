import '../globals.css'
import React from "react";


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
      {children}
      </>
  )
}
