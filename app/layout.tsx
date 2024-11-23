'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import localFont from 'next/font/local';

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
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }} 
        />
      </body>
    </html>
  );
}
