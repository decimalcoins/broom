'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/PiContext'; // <-- 1. Impor hook useAppContext

export default function AuthPage() {
  const router = useRouter();
  // 2. Dapatkan fungsi dan status dari context
  const { user, authenticate, isSdkReady } = useAppContext();
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 3. useEffect untuk mengalihkan pengguna jika mereka sudah login
  useEffect(() => {
    if (user) {
      router.push('/'); // Alihkan ke halaman utama jika sudah ada sesi user
    }
  }, [user, router]);

  // 4. handleLogin sekarang menggunakan fungsi 'authenticate' dari context
  const handleLogin = async () => {
    if (!isSdkReady) {
      setError("Pi SDK sedang dimuat, coba lagi sebentar.");
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      await authenticate();
      // Pengalihan akan ditangani oleh useEffect di atas
    } catch (err) {
      console.error(err);
      setError('Login gagal: ' + (err?.message || 'Terjadi kesalahan.'));
      setIsLoading(false);
    }
  };

  // Jika user sudah ada, tampilkan pesan loading saat dialihkan
  if (user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
        <p className="text-white">Anda sudah login, mengalihkan...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-xl text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Login dengan Pi</h2>
        <p className="mb-6 text-slate-400 text-center">Klik tombol di bawah untuk masuk dengan aman menggunakan akun Pi Anda.</p>
        
        {error && <p className="mb-4 text-red-400 text-center">{error}</p>}

        <button 
          onClick={handleLogin} 
          disabled={isLoading || !isSdkReady}
          className="w-full bg-tosca hover:bg-tosca-dark text-black font-bold px-4 py-3 rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Menunggu...' : 'Login dengan Pi'}
        </button>
      </div>
    </main>
  );
}
