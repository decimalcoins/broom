'use client';

import { useState } from 'react';

export default function LoginModal({ onRoleSelected, onCancel }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi baru untuk menangani login sebagai user
  const handleUserLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 1. Tentukan scope izin yang diminta (dalam kasus ini, username)
      const scopes = ['username'];

      // Fungsi ini akan dipanggil jika ada pembayaran yang belum selesai
      const onIncompletePaymentFound = (payment) => {
        console.log('Ditemukan pembayaran yang belum selesai:', payment);
        // Anda bisa menambahkan logika di sini untuk menyelesaikan pembayaran lama tersebut
        return; 
      };

      // 2. Panggil fungsi autentikasi Pi untuk meminta izin
      const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      
      console.log('Autentikasi berhasil, data pengguna:', authResult.user);

      // 3. Setelah berhasil, teruskan ke halaman utama sebagai 'user'
      // Anda juga bisa mengirim 'authResult.user' jika perlu data user di halaman utama
      onRoleSelected('user');

    } catch (err) {
      console.error('Gagal melakukan autentikasi Pi:', err);
      if (err.error === 'user_cancelled') {
        // Jika pengguna menekan tombol batal
        setError('Proses masuk dibatalkan.');
      } else {
        setError('Gagal memulai SDK Pi. Pastikan Anda di Pi Browser.');
      }
      setIsLoading(false);
    }
    // isLoading akan otomatis berhenti karena modal tertutup setelah onRoleSelected
  };

  // Fungsi untuk menangani pembayaran pendaftaran admin (tetap sama)
  const handleAdminRegistration = async () => {
    setIsLoading(true);
    setError('');
    
    const paymentData = {
      amount: 0.001,
      memo: 'Pendaftaran Admin Broom Marketplace',
      metadata: { type: 'admin_registration' },
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId) => {
        console.log('Pendaftaran admin siap untuk disetujui, paymentId:', paymentId);
        onRoleSelected('admin');
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        console.log('Pendaftaran admin siap untuk diselesaikan', { paymentId, txid });
      },
      onCancel: (paymentId) => {
        console.log('Pendaftaran admin dibatalkan', { paymentId });
        setIsLoading(false);
      },
      onError: (error, payment) => {
        console.error('Error pendaftaran admin:', error);
        setError('Gagal memproses pembayaran pendaftaran.');
        setIsLoading(false);
      },
    };

    try {
      await window.Pi.createPayment(paymentData, callbacks);
    } catch (err) {
      console.error('Gagal memanggil Pi SDK:', err);
      setError('Gagal memulai SDK Pi. Pastikan Anda di Pi Browser.');
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
          {/* Tombol User sekarang memanggil handleUserLogin */}
          <button 
            onClick={handleUserLogin}
            disabled={isLoading}
            className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-lg text-left disabled:opacity-50 disabled:cursor-wait"
          >
            <h3 className="font-bold">User</h3>
            <p className="text-sm text-slate-400">Masuk untuk melihat dan membeli produk.</p>
          </button>
          
          {/* Tombol Admin */}
          <button 
            onClick={handleAdminRegistration}
            disabled={isLoading}
            className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-lg text-left disabled:opacity-50 disabled:cursor-wait"
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

