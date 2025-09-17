'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPiSdk } from '@/lib/pi';

export default function PiLoginButton({ role = 'user' }) {
  const [pi, setPi] = useState(null);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');
  const router = useRouter();

  // Ambil Pi SDK ketika komponen dimount
  useEffect(() => {
    const sdk = getPiSdk();
    if (sdk) setPi(sdk);
  }, []);

  // --- LOGIN UTAMA ---
  const handleLogin = async () => {
    if (!pi) {
      setStatus('Pi SDK belum siap. Buka halaman ini di Pi Browser.');
      return;
    }

    try {
      setStatus('🔑 Mengautentikasi...');
      const me = await pi.authenticate({ permissions: ['username'] });
      setUser(me);

      if (role === 'user') {
        // Simpan data user & role
        localStorage.setItem('piUser', JSON.stringify(me));
        localStorage.setItem('role', 'user');
        router.push('/');
      } else if (role === 'admin') {
        setStatus('Login sukses, memulai pembayaran 0.001 π...');
        handlePayment(me);
      }
    } catch (err) {
      setStatus(`❌ Gagal login: ${err.message}`);
    }
  };

  // --- PEMBAYARAN ADMIN ---
  const handlePayment = (me) => {
    const paymentData = {
      amount: 0.001,
      memo: 'Biaya akses admin Broom Marketplace',
      metadata: { type: 'admin_fee', ts: Date.now() },
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId) => {
        setStatus(`Menunggu persetujuan server... (${paymentId})`);
        // Untuk demo, kita skip approve server
        setTimeout(() => {
          setStatus('Server menyetujui pembayaran, lanjut...');
        }, 1500);
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        setStatus(`✅ Pembayaran berhasil (TXID: ${txid})`);
        localStorage.setItem('piUser', JSON.stringify(me));
        localStorage.setItem('role', 'admin');
        router.push('/admin');
      },
      onCancel: () => setStatus('❌ Pembayaran dibatalkan'),
      onError: (e) => setStatus(`⚠️ Error: ${e.message}`),
    };

    pi.createPayment(paymentData, callbacks);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
      >
        {role === 'admin' ? 'Login sebagai Admin (0.001 π)' : 'Login sebagai User'}
      </button>
      {status && <p className="text-sm text-gray-500">{status}</p>}
    </div>
  );
}
