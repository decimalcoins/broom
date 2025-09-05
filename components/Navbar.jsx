'use client';

import Link from 'next/link';
// 1. Impor hook yang benar dari context
import { useAppContext } from '@/context/PiContext';

export default function Navbar({ onOpenLogin }) {
  // 2. Gunakan hook yang benar untuk mendapatkan user dan fungsi logout
  const { user, logout } = useAppContext();

  return (
    <header className="bg-slate-800 shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          Broom Marketplace
        </Link>
        <div className="flex items-center">
          {user ? (
            // Jika user sudah login, tampilkan nama dan tombol logout
            <>
              <span className="text-slate-300 mr-4">Halo, @{user.username}</span>
              <button 
                onClick={logout} 
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            // Jika belum login, tampilkan tombol login
            <button 
              onClick={onOpenLogin}
              className="bg-tosca hover:bg-tosca-dark text-black font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
