'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/PiContext';
// Navbar dan Footer tidak perlu diimpor di sini lagi
import { GCV_USD, USD_TO_IDR } from '@/lib/constants';

// === KOMPONEN-KOMPONEN UNTUK SETIAP TAB (DEFINISI LENGKAP) ===

// --- Komponen Profil Toko (Terhubung ke Backend) ---
const StoreProfile = () => {
  const { user } = useAppContext();
  const [formData, setFormData] = useState({ storeName: '', description: '' });
  const [storeImage, setStoreImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.username) {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/store/profile?username=${user.username}`);
          if (response.ok) {
            const data = await response.json();
            setFormData({
              storeName: data.storeName || '',
              description: data.description || '',
            });
            if (data.imageUrl) setImagePreview(data.imageUrl);
          }
        } catch (error) {
          console.error("Profil belum ada atau gagal dimuat:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoreImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    const data = new FormData();
    data.append('username', user.username);
    data.append('storeName', formData.storeName);
    data.append('description', formData.description);
    if (storeImage) data.append('storeImage', storeImage);

    try {
      const response = await fetch('/api/store/profile', { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Gagal menyimpan profil.');
      setMessage('Profil berhasil disimpan!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-center text-slate-400">Memuat profil toko...</p>;
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Profil Toko</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Foto Toko</label>
          <div className="mt-2 flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
              {imagePreview ? <img src={imagePreview} alt="Pratinjau Toko" className="w-full h-full object-cover" /> : <span className="text-slate-500 text-xs">Pratinjau</span>}
            </div>
            <label htmlFor="store-photo-upload" className="cursor-pointer bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded">Pilih Gambar</label>
            <input id="store-photo-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Nama Toko</label>
          <input type="text" name="storeName" value={formData.storeName} onChange={handleInputChange} placeholder="Contoh: Toko Barokah" className="w-full p-2 rounded bg-slate-700 border border-slate-600" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Deskripsi Toko</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Jelaskan tentang toko Anda..." className="w-full p-2 rounded bg-slate-700 border border-slate-600 h-24"></textarea>
        </div>
        <button type="submit" disabled={isLoading} className="bg-tosca hover:bg-tosca-dark text-black font-bold py-2 px-4 rounded disabled:opacity-50">{isLoading ? 'Menyimpan...' : 'Simpan Profil'}</button>
        {message && <p className={`mt-2 text-sm ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
      </form>
    </div>
  );
};

// --- Komponen Manajemen Produk ---
const ProductManagement = () => {
  const [currency, setCurrency] = useState('idr');
  const [price, setPrice] = useState('');
  const [convertedPrice, setConvertedPrice] = useState('');

  useEffect(() => {
    const priceValue = parseFloat(price);
    if (!price || isNaN(priceValue) || priceValue <= 0) {
      setConvertedPrice('');
      return;
    }
    if (currency === 'idr') {
      const piPrice = priceValue / USD_TO_IDR / GCV_USD;
      setConvertedPrice(`Setara dengan ${piPrice.toFixed(4)} π`);
    } else {
      const idrPrice = priceValue * GCV_USD * USD_TO_IDR;
      const formattedIDR = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(idrPrice);
      setConvertedPrice(`Setara dengan ${formattedIDR}`);
    }
  }, [price, currency]);

  return (
    <div className="bg-slate-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manajemen Produk</h2>
      <div className="border-b border-slate-600 pb-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">Tambah Produk Baru</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nama Produk" className="p-2 rounded bg-slate-700 border border-slate-600" />
          <select className="p-2 rounded bg-slate-700 border border-slate-600"><option>Pilih Kategori</option><option>Kebutuhan Pokok</option><option>Elektronik</option><option>Jasa</option></select>
          <textarea placeholder="Deskripsi Produk" className="md:col-span-2 p-2 rounded bg-slate-700 border border-slate-600 h-20"></textarea>
          <input type="number" placeholder="Stok" className="p-2 rounded bg-slate-700 border border-slate-600" />
          <div className="bg-slate-900 p-3 rounded-lg md:col-span-2">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Mata Uang</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-2 rounded bg-slate-700 border border-slate-600"><option value="idr">IDR (Rupiah)</option><option value="pi">π (Pi)</option></select>
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Harga</label>
                    <input type="number" placeholder="Masukkan harga" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 rounded bg-slate-700 border border-slate-600" />
                </div>
            </div>
            {convertedPrice && <p className="text-sm text-tosca mt-2 text-center">{convertedPrice}</p>}
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Gambar Produk</label>
            <input type="file" className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tosca file:text-black hover:file:bg-tosca-dark"/>
          </div>
          <button type="submit" className="md:col-span-2 bg-tosca hover:bg-tosca-dark text-black font-bold py-2 px-4 rounded">Tambah Produk</button>
        </form>
      </div>
      <p className="text-slate-400">Daftar produk akan ditampilkan di sini.</p>
    </div>
  );
};

// --- Komponen Pengaturan Pembayaran ---
const PaymentSettings = () => (
   <div className="bg-slate-800 p-6 rounded-lg">
    <h2 className="text-2xl font-bold mb-4">Pengaturan Pembayaran</h2>
    <form className="space-y-4">
      <div>
        <label className="block text-sm text-slate-400 mb-1">Nomor Rekening Bank (SeaBank)</label>
        <input type="text" placeholder="Contoh: 1234567890" className="w-full p-2 rounded bg-slate-700 border border-slate-600" />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Alamat Wallet Pi</label>
        <input type="text" placeholder="Contoh: GABCD...XYZ" className="w-full p-2 rounded bg-slate-700 border border-slate-600" />
      </div>
      <button type="submit" className="bg-tosca hover:bg-tosca-dark text-black font-bold py-2 px-4 rounded">Simpan Pengaturan</button>
    </form>
  </div>
);

// --- Komponen Info SHU ---
const ShuInfo = () => {
  const [shuData, setShuData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShuData = async () => {
      try {
        const response = await fetch('/api/shu');
        if (!response.ok) throw new Error('Gagal mengambil data SHU');
        const data = await response.json();
        setShuData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShuData();
  }, []);

  if (isLoading) {
    return <p className="text-center text-slate-400">Menghitung SHU...</p>;
  }
  if (error) {
    return <p className="text-center text-red-400">Error: {error}</p>;
  }

  return (
     <div className="bg-slate-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Informasi SHU</h2>
      <div className="text-center space-y-4">
        <div>
          <p className="text-slate-400">Total Pendapatan Iklan</p>
          <p className="text-2xl font-bold text-white mt-1">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(shuData.totalAdRevenue)}</p>
        </div>
        <div>
          <p className="text-slate-400">Dana SHU (15%)</p>
          <p className="text-2xl font-bold text-white mt-1">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(shuData.distributableShuPool)}</p>
        </div>
        <div>
          <p className="text-slate-400">Jumlah Admin Aktif</p>
          <p className="text-2xl font-bold text-white mt-1">{shuData.adminCount}</p>
        </div>
        <div className="border-t border-slate-600 pt-4">
          <p className="text-slate-300">Estimasi SHU Anda</p>
          <p className="text-4xl font-extrabold text-tosca mt-2">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(shuData.shuPerAdmin)}</p>
          <p className="text-sm text-slate-500 mt-1">Perhitungan berdasarkan data saat ini</p>
        </div>
      </div>
    </div>
  );
};

// === KOMPONEN UTAMA HALAMAN ADMIN ===
export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAdmin) {
        router.push('/');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Memverifikasi akses admin...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'products': return <ProductManagement />;
      case 'payments': return <PaymentSettings />;
      case 'shu': return <ShuInfo />;
      case 'profile': default: return <StoreProfile />;
    }
  };

  return (
    // Navbar dan Footer tidak disertakan lagi di sini
    <main className="container mx-auto p-6 flex-1">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      <div className="flex space-x-1 border-b border-slate-600 mb-6">
        <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Profil Toko</button>
        <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'products' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Produk</button>
        <button onClick={() => setActiveTab('payments')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'payments' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Pembayaran</button>
        <button onClick={() => setActiveTab('shu')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'shu' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>SHU</button>
      </div>
      {renderContent()}
    </main>
  );
}

