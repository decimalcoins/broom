
'use client';

import { useState, useEffect } from 'react';

// Fungsi untuk memformat angka ke Rupiah
const formatToIDR = (price) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(price);
};

export default function CheckoutModal({ product, onCheckout, onCancel }) {
  const [address, setAddress] = useState('');
  const [shipping, setShipping] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [totalPrice, setTotalPrice] = useState(product.price);
  
  // State baru untuk validasi dan status loading
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Efek ini akan berjalan setiap kali layanan pengiriman (shipping) berubah
  // Logika ini sudah benar dan tidak diubah.
  useEffect(() => {
    const getShippingCost = (service) => {
      switch (service) {
        case 'jnt': return 18000;
        case 'jne_cargo': return 35000;
        case 'gosend': return 25000;
        default: return 0;
      }
    };

    const cost = getShippingCost(shipping);
    setShippingCost(cost);

    if (product.currency.toLowerCase() === 'idr') {
      setTotalPrice(product.price + cost);
    }
  }, [shipping, product.price, product.currency]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Hapus pesan error sebelumnya

    if (!address || !shipping) {
      // Menggunakan state untuk menampilkan error, bukan alert()
      setError('Harap isi alamat dan pilih layanan pengiriman.');
      return;
    }

    setIsLoading(true); // Mulai proses loading

    // Simulasi pengiriman data ke server
    setTimeout(() => {
      onCheckout({ product, address, shipping, shippingCost, totalPrice });
      // setIsLoading(false) tidak perlu di sini karena komponen akan ditutup
    }, 1500); // Jeda 1.5 detik
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Formulir Checkout</h2>
        
        <div className="mb-6">
          <div className="flex items-start gap-4 p-4 bg-slate-700 rounded-lg">
              <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg"/>
              <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-xl font-bold text-slate-300 mt-1">
                    {product.currency.toLowerCase() === 'idr' 
                      ? formatToIDR(product.price) 
                      : `${product.price.toLocaleString()} π`}
                  </p>
              </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Alamat Lengkap</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Merdeka No. 123, Jakarta Pusat"
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 h-24 focus:outline-none focus:ring-2 focus:ring-tosca"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Pilihan Layanan Pengiriman</label>
            <select
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-tosca"
              required
            >
              <option value="">-- Pilih Pengiriman --</option>
              <option value="jnt">J&T Express</option>
              <option value="jne_cargo">JNE Cargo</option>
              <option value="gosend">GoSend Instant</option>
            </select>
          </div>

          {shippingCost > 0 && (
            <div className="mt-4 p-4 border-t border-slate-600 space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal Produk:</span>
                <span>{product.currency.toLowerCase() === 'idr' ? formatToIDR(product.price) : `${product.price.toLocaleString()} π`}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Biaya Pengiriman:</span>
                <span>{formatToIDR(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-tosca mt-2 pt-2 border-t border-slate-700">
                <span>Total Pembayaran:</span>
                <span>
                  {product.currency.toLowerCase() === 'idr' 
                    ? formatToIDR(totalPrice)
                    : `${product.price.toLocaleString()} π + ${formatToIDR(shippingCost)}`}
                </span>
              </div>
            </div>
          )}
          
          {/* Menampilkan pesan error di UI */}
          {error && <p className="text-red-400 text-sm text-center -mt-2">{error}</p>}

          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onCancel} className="bg-slate-600 hover:bg-slate-500 px-6 py-2 rounded-lg">Batal</button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-tosca hover:bg-tosca-dark px-6 py-2 rounded-lg font-bold w-48 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
