"use client";
import { useApp } from "@/context/AppContext";

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
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { getPiSdk } from '../lib/pi';

export default function LoginModal({ onRoleSelected, onCancel }) {
  const [pi, setPi] = useState(null);
  const [status, setStatus] = useState('Mendeteksi pengguna Pi Network...');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sdk = getPiSdk();
    if (sdk) {
      setPi(sdk);
      sdk.authenticate(['username', 'payments'])
        .then(auth => {
          setUser(auth.user);
          setStatus(`Terdeteksi sebagai: ${auth.user.username}`);
        })
        .catch(err => {
          // Jika autentikasi gagal (misalnya di luar Pi Browser), ini normal.
          console.warn("Autentikasi otomatis gagal, pengguna perlu memilih peran secara manual.", err);
          setStatus('Silakan pilih peran untuk melanjutkan.');
        });
    } else {
        // PERBAIKAN: Beri pesan jika SDK tidak termuat sama sekali
        setStatus('Gagal memuat Pi SDK. Pastikan Anda berada di Pi Browser dan coba lagi.');
    }
  }, []);

  const handleRoleSelect = (role) => {
    if (role === 'user') {
      onRoleSelected('user');
    } else if (role === 'admin') {
      // PERBAIKAN: Tambahkan pengecekan yang lebih kuat
      if (!pi) {
        setStatus('Pi SDK belum siap atau tidak tersedia. Tidak bisa melanjutkan pembayaran.');
        return;
      }

      setStatus('Memulai pembayaran untuk peran Admin...');
      try {
        pi.createPayment({
          amount: 0.001,
          memo: "Pembayaran akses Admin Broom Marketplace",
          metadata: { role: "admin_access" },
        }, {
          onReadyForServerCompletion: (paymentId, txid) => {
            setStatus(`Pembayaran sukses!`);
            onRoleSelected('admin');
          },
          onCancel: () => setStatus('Pembayaran dibatalkan.'),
          onError: (error) => setStatus(`Error Pembayaran: ${error.message || 'Terjadi kesalahan.'}`),
        });
      } catch (error) {
          // Tangkap error jika createPayment itu sendiri gagal dipanggil
          console.error("Gagal memulai proses pembayaran Pi:", error);
          setStatus(`Gagal memulai pembayaran. Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-white">Masuk Sebagai</h2>
        <p className="text-slate-400 mt-2 mb-6">{status}</p>
        
        <button
          onClick={() => handleRoleSelect('user')}
          className="w-full text-left p-4 mb-4 bg-slate-700 hover:bg-slate-600 rounded-lg"
        >
          <p className="font-semibold text-white">User</p>
          <p className="text-sm text-slate-400">Masuk untuk melihat dan membeli produk.</p>
        </button>
        
        <button
          onClick={() => handleRoleSelect('admin')}
          className="w-full text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-lg"
        >
          <p className="font-semibold text-tosca">Admin</p>
          <p className="text-sm text-slate-400">Bayar 0.001 π untuk mengelola produk dan toko.</p>
        </button>
        
        <div className="text-center mt-6">
          <button onClick={onCancel} className="text-slate-400 hover:text-white">
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

