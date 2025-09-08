'use client';

import { PiProvider } from '@/context/PiContext';
import './globals.css';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Broom Marketplace",
  description: "Marketplace demo powered by Next.js + Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen text-white bg-slate-900 flex flex-col">
        <PiProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </PiProvider>
      </body>
    </html>
  );
}
