'use client';

import Link from 'next/link';
// 1. Impor hook yang benar dari context
import { useAppContext } from '@/context/PiContext';

export default function Navbar({ onOpenLogin }) {
  // 2. Ambil 'user', 'isAdmin', dan 'logout' dari context
  const { user, isAdmin, logout } = useAppContext();

  return (
    <header className="bg-slate-800 shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          Broom Marketplace
        </Link>
        <div className="flex items-center">
          {user ? (
            // === PERUBAHAN: Tampilkan tombol dinamis jika user sudah login ===
            <div className="flex items-center gap-4">
              <span className="text-slate-300 hidden sm:block">Halo, @{user.username}</span>
              
              {/* Jika user SUDAH admin, tampilkan link ke dashboard */}
              {isAdmin && (
                 <Link href="/admin" className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded">
                    Dashboard Admin
                 </Link>
              )}

              <button 
                onClick={logout} 
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
            // =============================================================
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

