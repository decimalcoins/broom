'use client';

import { useState } from 'react';

export default function LoginModal({ onRoleSelected, onCancel }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk menangani pembayaran pendaftaran admin
  const handleAdminRegistration = async () => {
    setIsLoading(true);
    setError('');

    // 1. Definisikan detail pembayaran
    const paymentData = {
      amount: 0.001, // Biaya pendaftaran
      memo: 'Pendaftaran Admin Broom Marketplace',
      metadata: { type: 'admin_registration' },
    };

    // 2. Definisikan SEMUA fungsi callback yang dibutuhkan
    const callbacks = {
      onReadyForServerApproval: (paymentId) => {
        // Untuk pendaftaran sederhana, kita bisa langsung anggap berhasil di frontend
        // Idealnya, Anda juga mengirim paymentId ini ke backend untuk dicatat
        console.log('Pendaftaran admin siap untuk disetujui, paymentId:', paymentId);
        onRoleSelected('admin'); // Langsung teruskan ke halaman admin
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        // Backend yang akan menangani ini, bisa dikosongkan di frontend
        console.log('Pendaftaran admin siap untuk diselesaikan', { paymentId, txid });
      },
      onCancel: (paymentId) => {
        // Pengguna membatalkan pembayaran
        console.log('Pendaftaran admin dibatalkan', { paymentId });
        setIsLoading(false);
      },
      onError: (error, payment) => {
        // Terjadi error saat proses pembayaran
        console.error('Error pendaftaran admin:', error);
        setError('Gagal memproses pembayaran pendaftaran.');
        setIsLoading(false);
      },
    };

    // 3. Panggil Pi SDK dengan data dan callback
    try {
      await window.Pi.createPayment(paymentData, callbacks);
    } catch (err) {
      console.error('Gagal memanggil Pi SDK:', err);
      // Cek apakah error karena callback hilang, meskipun seharusnya sudah diperbaiki
      if (err.message.includes('callback')) {
          setError('Terjadi kesalahan teknis (callback error).');
      } else {
          setError('Gagal memulai SDK Pi. Pastikan Anda di Pi Browser.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-sm text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Masuk Sebagai</h2>
        
        {/* Pesan Error */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Tombol User */}
          <button 
            onClick={() => onRoleSelected('user')}
            className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-lg text-left"
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
