'use client';

import { useState } from 'react';
// Impor semua konstanta yang dibutuhkan dari file terpusat
import { GCV_IN_IDR, totalAdRevenue, totalAdmins, categories } from '../lib/constants';

export default function AdminDashboard({ onLogout }) {
  const [product, setProduct] = useState({ name: '', stock: '', priceIdr: '', category: '' });
  const [store, setStore] = useState({ 
    piWallet: '', 
    seaBank: '', 
    piActive: true,
    seaBankActive: true
  });
  const [status, setStatus] = useState('');

  // Gunakan data SHU yang diimpor
  const shuBase = totalAdRevenue * 0.50;
  const adminShare = shuBase * 0.15;
  const shuPerAdmin = adminShare / totalAdmins;

  // Handler untuk semua input produk
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const calculatePiPrice = () => {
    const priceIdrFloat = parseFloat(product.priceIdr);
    // Gunakan GCV_IN_IDR yang diimpor
    if (!priceIdrFloat || GCV_IN_IDR === 0) return '0.00000000';
    return (priceIdrFloat / GCV_IN_IDR).toFixed(8);
  };
  
  // Handler untuk semua input pengaturan toko
  const handleStoreChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStore(s => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUpdatePaymentInfo = (e) => {
    e.preventDefault();
    setStatus('Memperbarui info pembayaran...');
    alert(`LOGIKA BACKEND: Info Pembayaran Disimpan!`);
  };
  
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!product.category) {
        alert('Harap pilih kategori produk.');
        return;
    }
    setStatus(`Menambahkan produk: ${product.name}`);
    alert('LOGIKA BACKEND: Produk ditambahkan!');
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 p-8 bg-slate-900 rounded-lg text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-tosca">Dasbor Admin</h1>
        <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Logout</button>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 text-tosca">SHU Iklan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
             <div><p className="text-slate-400 text-sm">Pendapatan Iklan</p><p className="font-bold text-lg">{totalAdRevenue} π</p></div>
             <div><p className="text-slate-400 text-sm">Dana SHU (50%)</p><p className="font-bold text-lg">{shuBase} π</p></div>
             <div><p className="text-slate-400 text-sm">Total Admin</p><p className="font-bold text-lg">{totalAdmins}</p></div>
             <div><p className="text-slate-400 text-sm">SHU per Admin</p><p className="font-bold text-lg text-green-400">{shuPerAdmin.toFixed(8)} π</p></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-800 p-6 rounded-lg md:col-span-2">
           <h2 className="text-xl font-semibold mb-4">Manajemen Produk</h2>
           <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                <input type="text" name="name" placeholder="Nama Produk" value={product.name} onChange={handleProductChange} className="p-2 rounded bg-slate-700 border border-slate-600" required />
                
                <select 
                    name="category" 
                    value={product.category} 
                    onChange={handleProductChange} 
                    className="p-2 rounded bg-slate-700 border border-slate-600" 
                    required
                >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <input type="number" name="stock" placeholder="Jumlah Stok" value={product.stock} onChange={handleProductChange} className="p-2 rounded bg-slate-700 border border-slate-600" required />
                <input type="number" name="priceIdr" placeholder="Harga (IDR)" value={product.priceIdr} onChange={handleProductChange} className="p-2 rounded bg-slate-700 border border-slate-600" required />
                <div className="p-2 rounded bg-slate-700 border border-slate-600">
                    <p className="text-sm text-slate-400">Harga Pi (GCV: Rp {GCV_IN_IDR.toLocaleString('id-ID')})</p>
                    <p className="font-bold text-tosca">{calculatePiPrice()} π</p>
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Gambar Produk</label>
                    <input type="file" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tosca file:text-black hover:file:bg-tosca-dark" required />
                </div>
                <button type="submit" className="bg-tosca hover:bg-tosca-dark p-2 rounded font-bold">Tambah Produk</button>
            </form>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Pengaturan Toko</h2>
          <form onSubmit={handleUpdatePaymentInfo} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm text-slate-400 mb-1">Foto Profil Toko</label>
                <input type="file" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" required />
            </div>
            <hr className="border-slate-600" />
            <h3 className="font-semibold mt-2">Info Pembayaran</h3>
            <input 
              type="text" 
              name="piWallet"
              placeholder="Alamat Wallet Pi Anda"
              value={store.piWallet}
              onChange={handleStoreChange}
              className="p-2 rounded bg-slate-700 border border-slate-600" 
              required 
            />
            <input 
              type="text" 
              name="seaBank"
              placeholder="No. Rekening SeaBank"
              value={store.seaBank}
              onChange={handleStoreChange}
              className="p-2 rounded bg-slate-700 border border-slate-600" 
              required 
            />
            <hr className="border-slate-600" />
            <h3 className="font-semibold mt-2">Metode Pembayaran Aktif</h3>
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="piActive" checked={store.piActive} onChange={handleStoreChange} className="w-4 h-4 text-tosca bg-gray-700 border-gray-600 rounded"/>
                    <span>Terima Pembayaran Pi Wallet</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="seaBankActive" checked={store.seaBankActive} onChange={handleStoreChange} className="w-4 h-4 text-tosca bg-gray-700 border-gray-600 rounded"/>
                    <span>Terima Pembayaran SeaBank</span>
                </label>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold mt-2">Simpan Pengaturan</button>
          </form>
        </div>
      </div>
    </div>
  );
}

