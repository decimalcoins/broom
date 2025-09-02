"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Pastikan impor ini menggunakan useAppContext
import { useAppContext } from "@/context/PiContext";

export default function PaymentPage() {
  const router = useRouter();
  // Pastikan hook yang digunakan di sini adalah useAppContext
  const { createPayment, isSdkReady, setIsAdmin } = useAppContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!isSdkReady) {
      setError("Pi SDK sedang dimuat, coba lagi sebentar.");
      return;
    }
    
    setIsLoading(true);
    setError('');

    const paymentData = {
      amount: 0.001,
      memo: 'Aktivasi Akun Penjual Broom Marketplace',
      metadata: { type: 'seller_activation' },
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId) => {
        console.log('Aktivasi penjual siap disetujui, paymentId:', paymentId);
        alert("Pembayaran 0.001 Pi berhasil! Akun Anda sekarang telah diaktifkan sebagai penjual.");
        setIsAdmin(true);
        router.push("/admin");
      },
      onCancel: () => {
        console.log('Aktivasi penjual dibatalkan.');
        setIsLoading(false);
      },
      onError: (err) => {
        console.error('Error aktivasi penjual:', err);
        setError('Gagal memproses pembayaran.');
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
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Navbar onOpenLogin={() => {}} />
      <main className="max-w-2xl mx-auto p-8 flex-1 flex items-center">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full">
          <div className="text-teal-400 text-5xl w-full flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
          </div>
          <h1 className="text-3xl font-bold text-white mt-4 text-center">Aktivasi Akun Penjual</h1>
          <p className="text-slate-400 mt-2 max-w-md mx-auto text-center">Lakukan pembayaran untuk mulai menjual produk Anda.</p>
          
          {error && <p className="text-red-400 text-center mt-4">{error}</p>}

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">Detail Pembayaran</h2>
            <div className="bg-slate-700 rounded-lg p-6 text-center">
              <p className="text-slate-300">Total Biaya Aktivasi</p>
              <p className="text-4xl font-extrabold text-white mt-2">0.001 <span className="text-teal-400">π</span></p>
            </div>
            <button 
              onClick={handlePayment} 
              disabled={isLoading || !isSdkReady}
              className="mt-8 w-full text-lg font-semibold text-white px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoading ? 'Memproses...' : 'Bayar dan Aktifkan Akun'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
