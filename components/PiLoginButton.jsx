'use client';

import { useEffect, useState } from 'react';
import { getPiSdk } from '../lib/pi'; // <-- Impor fungsi yang benar

export default function PiLoginButton() {
  const [pi, setPi] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');

  // useEffect dijalankan di sisi klien (browser)
  useEffect(() => {
    // Panggil helper untuk mendapatkan objek Pi SDK
    const sdk = getPiSdk();
    if (sdk) {
      setPi(sdk);
    }
  }, []);

  const handlePayment = () => {
    if (!pi) {
      setPaymentStatus("Pi SDK belum siap.");
      return;
    }

    setPaymentStatus("Membuat pembayaran...");

    const paymentData = {
      amount: 0.001, // Ganti dengan jumlah yang Anda inginkan
      memo: "Demo pembayaran Broom Marketplace",
      metadata: { orderId: "order123" },
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId) => {
        setPaymentStatus(`Menunggu persetujuan server untuk paymentId: ${paymentId}`);
        // Di aplikasi nyata, Anda akan mengirim paymentId ini ke server Anda
        // lalu server Anda akan memanggil endpoint Pi untuk menyetujui.
        // Untuk demo, kita anggap server langsung setuju.
        setTimeout(() => {
            alert(`DEMO: Server menyetujui pembayaran ${paymentId}. Lanjutkan di aplikasi Pi.`);
        }, 3000);
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        setPaymentStatus(`Pembayaran selesai! TXID: ${txid}`);
         // Di aplikasi nyata, server Anda akan memverifikasi TXID
         // lalu mengirim barang/layanan.
      },
      onCancel: (paymentId) => {
        setPaymentStatus(`Pembayaran dibatalkan: ${paymentId}`);
      },
      onError: (error) => {
        setPaymentStatus(`Error: ${error.message}`);
      },
    };

    pi.createPayment(paymentData, callbacks);
  };

  return (
    <div className="flex flex-col items-center gap-4">
        <button 
          onClick={handlePayment} 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Bayar 0.1 π (Demo)
        </button>
        {paymentStatus && <p className="text-sm text-gray-400">{paymentStatus}</p>}
    </div>
  );
}