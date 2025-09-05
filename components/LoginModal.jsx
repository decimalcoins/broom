'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/PiContext';

export default function LoginModal({ onRoleSelected, onCancel }) {
  const { 
    authenticate, 
    createPayment, 
    isSdkReady, 
    setIsAdmin,
    user // Ambil 'user' dari context untuk pendaftaran admin
  } = useAppContext(); 
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi login user sekarang meminta semua izin
  const handleUserLogin = async () => {
    if (!isSdkReady) {
      setError("Pi SDK sedang dimuat...");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const authResult = await authenticate();
      onRoleSelected('user', authResult.user);
    } catch (err) {
      console.error("Authentication Error Details:", err);
      setError(err.message || 'Gagal melakukan autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logika pendaftaran admin sekarang lebih sederhana
  const handleAdminRegistration = async () => {
    if (!isSdkReady) {
      setError("Pi SDK sedang dimuat...");
      return;
    }

    // Pengguna harus login dulu untuk mendapatkan username mereka
    if (!user) {
        setError("Silakan login sebagai 'User' terlebih dahulu.");
        return;
    }
    
    setIsLoading(true);
    setError('');

    const paymentData = {
      amount: 0.001,
      memo: 'Pendaftaran Admin Broom Marketplace',
      metadata: { type: 'admin_registration', username: user.username },
    };

    const callbacks = {
      onReadyForServerApproval: async (paymentId) => {
        try {
            // Kirim username ke backend untuk disimpan
            await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username }),
            });
            setIsAdmin(true);
            onRoleSelected('admin');
        } catch (dbError) {
            setError("Pembayaran berhasil, tetapi gagal mendaftarkan admin.");
            setIsLoading(false);
        }
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        console.log('Pendaftaran admin selesai di server', { paymentId, txid });
      },
      onCancel: () => setIsLoading(false),
      onError: () => setError('Gagal memproses pembayaran.'),
    };
    
    try {
      // Karena izin sudah didapatkan saat login, kita bisa langsung membuat pembayaran.
      await createPayment(paymentData, callbacks);
    } catch(err) {
      setError(err.message || 'Gagal memulai pembayaran.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-sm text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Masuk Sebagai</h2>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button 
            onClick={handleUserLogin}
            disabled={isLoading || !isSdkReady}
            className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-lg text-left disabled:opacity-50"
          >
            <h3 className="font-bold">User</h3>
            <p className="text-sm text-slate-400">Masuk untuk melihat dan membeli produk.</p>
          </button>
          
          <button 
            onClick={handleAdminRegistration}
            disabled={isLoading || !isSdkReady}
            className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-lg text-left disabled:opacity-50"
          >
            <h3 className="font-bold">Admin</h3>
            <p className="text-sm text-slate-400">Bayar 0.001 π untuk mengelola produk dan toko.</p>
          </button>
        </div>
        
        <button 
          onClick={onCancel} 
          className="w-full text-center mt-6 text-slate-400 hover:text-white text-sm"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

