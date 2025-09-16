'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/PiContext';
import CheckoutModal from '@/components/CheckoutModal';

export default function UserPage() {
  const { user, isLoading } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Gagal memuat produk');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Memuat data pengguna...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">
        {user ? `Halo, ${user.username} 👋` : 'Selamat datang di Broom Marketplace'}
      </h1>

      <p className="text-slate-400 mb-8">
        {user
          ? 'Pilih produk untuk membeli.'
          : 'Login lewat Pi Browser untuk pengalaman penuh.'}
      </p>

      {loadingProducts ? (
        <p className="text-slate-400">Memuat produk...</p>
      ) : error ? (
        <p className="text-red-400">Error: {error}</p>
      ) : products.length === 0 ? (
        <p className="text-slate-400">Belum ada produk yang diunggah.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/50 p-4 rounded-xl shadow hover:shadow-cyan-500/20 transition"
            >
              <div className="w-full h-40 bg-slate-700 rounded-lg mb-3 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-slate-500">
                    Tanpa Gambar
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-slate-400 text-sm mb-2">{item.description}</p>
              <p className="font-bold text-cyan-400 mb-3">{item.priceLabel}</p>
              {user && (
                <button
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-cyan-500/40 transition"
                  onClick={() => setSelectedProduct(item)}
                >
                  Beli
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}
