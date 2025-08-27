"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const { adminProducts, setAdminProducts, sellerBankAccount, setSellerBankAccount } = useApp();
  const [form, setForm] = useState({ name: "", category: "Kebutuhan Pokok", stock: 0, price: 0, currency: "pi" });
  const hasBankAccount = sellerBankAccount.number && sellerBankAccount.name && sellerBankAccount.piWallet;

  const addProduct = (e) => {
    e.preventDefault();
    const id = Date.now();
    const image = `https://placehold.co/400x400/7c3aed/ffffff?text=${form.name.split(' ')[0] || 'Produk'}`;
    setAdminProducts(prev => [...prev, { ...form, id, price: parseFloat(form.price), stock: parseInt(form.stock, 10), image }]);
    setForm({ name: "", category: "Kebutuhan Pokok", stock: 0, price: 0, currency: "pi" });
  };

  const savePayment = (e) => {
    e.preventDefault();
    alert("Pengaturan pembayaran berhasil disimpan!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenLogin={()=>{}}/>
      <main className="max-w-7xl mx-auto p-4 md:p-8 flex-1">
        <h1 className="text-4xl font-bold text-white mb-8">Panel Admin</h1>
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">Tambah Produk Baru</h2>
              <form onSubmit={addProduct} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Nama Produk</label>
                  <input required type="text" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-teal-500"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Kategori</label>
                    <select value={form.category} onChange={e=>setForm(f=>({...f, category: e.target.value}))} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-teal-500">
                      <option value="Kebutuhan Pokok">Kebutuhan Pokok</option>
                      <option value="Elektronik">Elektronik</option>
                      <option value="Kendaraan">Kendaraan</option>
                      <option value="Aksesoris">Aksesoris</option>
                      <option value="Toys">Toys</option>
                      <option value="Fashion">Fashion</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Jumlah Stok</label>
                    <input required type="number" value={form.stock} onChange={e=>setForm(f=>({...f, stock: e.target.value}))} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-teal-500"/>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-sm text-slate-400">Harga</label>
                    <input required type="number" value={form.price} onChange={e=>setForm(f=>({...f, price: e.target.value}))} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-teal-500"/>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Mata Uang</label>
                    <select value={form.currency} onChange={e=>setForm(f=>({...f, currency: e.target.value}))} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-teal-500">
                      <option value="pi">Pi</option>
                      <option value="idr">IDR</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full mt-4 flex items-center justify-center text-md font-semibold text-white px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:scale-105 transition-all">
                  Tambah ke Katalog
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Produk Anda</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminProducts.length > 0 ? adminProducts.map(p => (
                  <ProductCard key={p.id} product={p} onBuy={()=>{}} onChat={()=>{}} user={{}}/>
                )) : <p className="text-slate-400 col-span-full">Anda belum menambahkan produk.</p>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">Pengaturan Pembayaran</h2>
              {hasBankAccount ? (
                <div className="text-left">
                  <p className="text-slate-300">Rekening Anda saat ini:</p>
                  <div className="mt-2 text-sm bg-slate-700 p-4 rounded-lg space-y-1">
                    <p>Bank: <span className="font-semibold text-white">SeaBank</span></p>
                    <p>No. Rekening: <span className="font-semibold text-white">{sellerBankAccount.number}</span></p>
                    <p>Atas Nama: <span className="font-semibold text-white">{sellerBankAccount.name}</span></p>
                    <p>Wallet Pi: <span className="font-semibold text-white break-all">{sellerBankAccount.piWallet}</span></p>
                  </div>
                  <button onClick={()=>setSellerBankAccount({number:'', name:'', piWallet:''})} className="text-sm text-teal-400 hover:underline mt-4">Edit</button>
                </div>
              ) : (
                <form onSubmit={e=>{e.preventDefault(); alert('Pengaturan pembayaran berhasil disimpan!');}} className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400">Nomor Rekening SeaBank</label>
                    <input required type="text" onChange={e=>setSellerBankAccount(s=>({...s, number: e.target.value}))} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-teal-500"/>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Nama Pemilik Rekening</label>
                    <input required type="text" onChange={e=>setSellerBankAccount(s=>({...s, name: e.target.value}))} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-teal-500"/>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Alamat Wallet Pi</label>
                    <input required type="text" placeholder="G..." onChange={e=>setSellerBankAccount(s=>({...s, piWallet: e.target.value}))} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-teal-500"/>
                  </div>
                  <button type="submit" className="w-full mt-2 flex items-center justify-center text-md font-semibold text-white px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition-all">
                    Simpan Pengaturan
                  </button>
                </form>
              )}
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">Keuangan & SHU</h2>
              <p className="text-slate-400 text-sm mb-4">Lihat Sisa Hasil Usaha (SHU) dari pendapatan iklan aplikasi.</p>
              <Link href="/shu" className="block w-full text-md font-semibold text-white px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 transition-all text-center">
                Lihat Sisa Hasil Usaha (SHU)
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
