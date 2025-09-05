'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context'; // Pastikan ini sesuai dengan context.js Anda

export default function PaymentPage() {
  const { isSdkReady, authenticate, createPayment, setIsAdmin } = useAppContext();
  const [error, setError] = useState(null);

  const handleAdminPayment = async () => {
    setError(null);

    try {
      if (!isSdkReady) throw new Error("Pi SDK belum siap.");

      // 1. Autentikasi User Pi Network
      const userData = await authenticate();

      // 2. Buat pembayaran ke Pi Server
      await createPayment(
        {
          amount: 0.001,
          memo: "Admin Fee for Broom Marketplace",
          metadata: { type: "admin_fee" },
          uid: userData.uid,
        },
        {
          onReadyForServerApproval: async (paymentId) => {
            // 3. Kirim ke backend untuk APPROVE & COMPLETE
            const res = await fetch("/api/payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId })
            });
            const data = await res.json();
            if (!data.success) throw new Error("Server gagal memproses pembayaran");
          },
          onReadyForServerCompletion: (paymentId, txid) => {
            console.log("Siap diselesaikan:", paymentId, txid);
          },
          onCompleted: (paymentId, txid) => {
            console.log("Pembayaran selesai:", paymentId, txid);
            setIsAdmin(true); // Berikan hak Admin setelah sukses
          },
          onCancelled: (paymentId) => {
            setError("Pembayaran dibatalkan.");
          },
          onError: (error, paymentId) => {
            console.error("Error pembayaran:", error);
            setError("Gagal memproses pembayaran.");
          }
        }
      );

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Masuk Sebagai</h1>

      {error && <div className="bg-red-600 p-2 rounded mb-3">{error}</div>}

      <div className="space-y-3 w-64">
        <button
          onClick={authenticate}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
        >
          User - Masuk untuk melihat produk
        </button>

        <button
          onClick={handleAdminPayment}
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded"
        >
          Admin - Bayar 0.001π untuk mengelola produk
        </button>

        <button
          onClick={() => window.location.href = "/"}
          className="w-full bg-gray-600 hover:bg-gray-700 p-2 rounded"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
