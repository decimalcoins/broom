
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

