'use client';

import { useEffect } from 'react';
import localFont from 'next/font/local';
import {Toaster} from "@/components/ui/toaster";
import "./globals.css";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: '--font-geist-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.classList.add('mdl-js');
  }, []);

  return (
    <html
      lang="en"
      className={geistSans.variable}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
