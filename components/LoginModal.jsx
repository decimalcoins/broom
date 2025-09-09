<<<<<<< HEAD
"use client";
import { useApp } from "@/context/PiContext";

export default function LoginModal({ open, onClose }) {
  const { setUser, setIsAdmin } = useApp();
  if (!open) return null;

  const login = (role) => {
    const isSeller = role === 'seller';
    setUser({ username: isSeller ? 'admin001' : 'user789' });
    setIsAdmin(isSeller);
    onClose(isSeller ? "/payment" : null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl text-center w-full max-w-md m-4">
        <h2 className="text-2xl font-bold text-white">Masuk Sebagai</h2>
        <p className="text-slate-400 mt-2 mb-8">Pilih peran Anda di Broom Marketplace.</p>
        <div className="space-y-4">
          <button onClick={()=>login('buyer')} className="w-full flex items-center text-left p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <span className="text-emerald-400"><svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg></span>
            <div className="ml-4">
              <p className="font-semibold text-white">User</p>
              <p className="text-sm text-slate-400">Masuk untuk melihat dan membeli produk.</p>
            </div>
          </button>
          <button onClick={()=>login('seller')} className="w-full flex items-center text-left p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <span className="text-emerald-400"><svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>
            <div className="ml-4">
              <p className="font-semibold text-white">Admin</p>
              <p className="text-sm text-slate-400">Masuk untuk mengelola produk dan toko.</p>
            </div>
          </button>
        </div>
        <button onClick={()=>onClose(null)} className="text-sm text-slate-500 hover:text-white mt-8">Batal</button>
=======
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
>>>>>>> 0751ac4dc29c6cc66cab38788480060f410e82ba
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> 0751ac4dc29c6cc66cab38788480060f410e82ba
