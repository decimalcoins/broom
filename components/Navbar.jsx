'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold hover:text-yellow-400">
          Broom
        </Link>

        {/* Menu */}
        <nav className="flex gap-6">
          <Link href="/" className="hover:text-yellow-400">
            Home
          </Link>
          <Link href="/products" className="hover:text-yellow-400">
            Produk
          </Link>
          <Link href="/about" className="hover:text-yellow-400">
            Tentang
          </Link>
          <Link href="/contact" className="hover:text-yellow-400">
            Kontak
          </Link>
        </nav>
      </div>
    </header>
  );
}
