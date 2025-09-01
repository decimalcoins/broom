'use client';

import { useState } from 'react';
// === PERBAIKAN: Menggunakan nama hook yang benar ===
import { useAppContext } from '@/context/PiContext';

export default function LoginModal({ onRoleSelected, onCancel }) {
  // === PERBAIKAN: Menggunakan nama hook yang benar ===
  const { authenticate, createPayment, isSdkReady, setIsAdmin } = useAppContext(); 
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUserLogin = async () => {
    if (!isSdkReady) {
      setError("Pi SDK sedang dimuat, coba lagi sebentar.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const userData = await authenticate();
      onRoleSelected('user', userData);
    } catch (err) {
      setError('Gagal melakukan autentikasi dengan Pi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminRegistration = async () => {
    if (!isSdkReady) {
      setError("Pi SDK sedang dimuat, coba lagi sebentar.");
      return;
    }
    
    setIsLoading(true);
    setError('');

    const paymentData = {
      amount: 0.001,
      memo: 'Pendaftaran Admin Broom Marketplace',
      metadata: { type: 'admin_registration' },
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId) => {
        console.log('Pendaftaran admin siap disetujui, paymentId:', paymentId);
        setIsAdmin(true);
        onRoleSelected('admin');
      },
      onCancel: () => {
        console.log('Pendaftaran admin dibatalkan.');
        setIsLoading(false);
      },
      onError: (error) => {
        console.error('Error pendaftaran admin:', error);
        setError('Gagal memproses pembayaran pendaftaran.');
        setIsLoading(false);
      },
    };

    try {
      await createPayment(paymentData, callbacks);
    } catch (err) {
      console.error('Gagal memanggil createPayment:', err);
      setError('Gagal memulai proses pembayaran.');
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

