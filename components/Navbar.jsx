'use client';

import Link from 'next/link';
import { Home, Package, Info, Phone } from 'lucide-react';

export default function FuturisticUI() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white relative pb-24">
      {/* Header / Hero */}
      <header className="text-center py-10">
        <h1 className="text-3xl font-extrabold text-cyan-400 tracking-wide drop-shadow-md">
          Broom Marketplace 🚀
        </h1>
        <p className="text-slate-400 mt-2">Belanja dengan nuansa futuristik</p>
      </header>

      {/* Produk Grid */}
      <main className="px-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((id) => (
          <div
            key={id}
            className="bg-slate-800/50 backdrop-blur-lg border border-cyan-500/20 
                       rounded-2xl shadow-lg hover:shadow-cyan-500/20 
                       transition p-4 flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-xl mb-4"></div>
            <h3 className="font-semibold text-lg">Produk {id}</h3>
            <p className="text-slate-400 text-sm mb-4">Deskripsi singkat produk {id}.</p>
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 
                               text-white font-bold px-4 py-2 rounded-lg 
                               shadow-md hover:shadow-cyan-500/40 transition">
              Beli Sekarang
            </button>
          </div>
        ))}
      </main>

      {/* Navbar futuristik */}
      <nav
        className="fixed bottom-4 left-1/2 -translate-x-1/2 
                   bg-slate-800/70 backdrop-blur-xl 
                   border border-slate-700/50 
                   rounded-2xl shadow-lg 
                   px-6 py-3 flex justify-around items-center 
                   w-[90%] max-w-md text-white"
      >
        <Link href="/" className="flex flex-col items-center hover:text-cyan-400 transition">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/products" className="flex flex-col items-center hover:text-cyan-400 transition">
          <Package className="w-6 h-6" />
          <span className="text-xs mt-1">Produk</span>
        </Link>
        <Link href="/about" className="flex flex-col items-center hover:text-cyan-400 transition">
          <Info className="w-6 h-6" />
          <span className="text-xs mt-1">Tentang</span>
        </Link>
        <Link href="/contact" className="flex flex-col items-center hover:text-cyan-400 transition">
          <Phone className="w-6 h-6" />
          <span className="text-xs mt-1">Kontak</span>
        </Link>
      </nav>
    </div>
  );
}
