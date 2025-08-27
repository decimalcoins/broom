"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { totalAdRevenue, totalAdmins } from "@/lib/constants";

export default function SHUPage() {
  const danaIklan = totalAdRevenue * 0.50;
  const shuPool = danaIklan * 0.15;
  const shuPerAdmin = shuPool / totalAdmins;

  const today = new Date();
  const isWithdrawalDay = (today.getMonth() === 11) && (today.getDate() === 30); // 30 Dec

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenLogin={()=>{}}/>
      <main className="max-w-3xl mx-auto p-8 flex-1">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl text-center">
          <div className="w-full flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z"></path></svg>
          </div>
          <h1 className="text-3xl font-bold text-white mt-4">Sisa Hasil Usaha (SHU)</h1>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">SHU dibagikan setiap tanggal 30 Desember dari keuntungan iklan aplikasi.</p>

          <div className="bg-slate-700 rounded-lg p-6 my-8 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Pendapatan Iklan</span>
              <span className="font-semibold text-white">π {totalAdRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dana Alokasi (50%)</span>
              <span className="font-semibold text-white">π {danaIklan.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dana SHU Dibagikan (15%)</span>
              <span className="font-semibold text-white">π {shuPool.toLocaleString()}</span>
            </div>
            <hr className="border-slate-600"/>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Admin Terdaftar</span>
              <span className="font-semibold text-white">{totalAdmins.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-slate-300 font-semibold">Estimasi SHU per Admin</span>
              <span className="font-bold text-amber-400">π {shuPerAdmin.toFixed(6)}</span>
            </div>
          </div>

          <button disabled={!isWithdrawalDay} onClick={()=>alert(`Selamat! Penarikan SHU sebesar π ${shuPerAdmin.toFixed(6)} telah diproses ke wallet Anda.`)} className={`w-full text-lg font-semibold text-white px-8 py-4 rounded-full transition-all ${isWithdrawalDay ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:scale-105' : 'disabled-btn'}`}>
            {isWithdrawalDay ? 'Tarik SHU Sekarang' : 'Penarikan Dibuka 30 Desember'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
