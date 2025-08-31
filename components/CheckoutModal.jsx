
'use client';

import { useState } from 'react';

// Fungsi format Rupiah tetap sama
const formatToIDR = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};

export default function CheckoutModal({ product, onCheckout, onCancel }) {
  const [address, setAddress] = useState('');
  // === PERBAIKAN: Menghapus satu tanda '=' yang berlebih ===
  const [shipping, setShipping] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePiCheckout = async () => {
    if (!address || !shipping) {
      setError('Harap isi alamat dan pilih layanan pengiriman.');
      return;
    }
    setError('');
    setIsLoading(true);

    const paymentData = {
      // Pastikan harga dikirim sebagai angka, bukan string
      amount: Number(product.price),
      memo: `Pembelian: ${product.name}`,
      metadata: { productId: product.id, address, shipping },
    };

    const callbacks = {
      onReadyForServerApproval: function(paymentId) {
        // Kirim paymentId ke parent komponen (page.jsx) untuk diteruskan ke backend
        onCheckout({ paymentId, product, address, shipping });
      },
      onReadyForServerCompletion: function(paymentId, txid) {
        console.log('Pi payment ready for server completion', { paymentId, txid });
        // Server kita yang akan menangani ini
      },
      onCancel: function(paymentId) {
        console.log('Pi payment cancelled', { paymentId });
        setIsLoading(false);
      },
      onError: function(error, payment) {
        console.error('Error during Pi payment', error);
        setError('Terjadi kesalahan dengan pembayaran Pi.');
        setIsLoading(false);
      },
    };

    try {
      // Memulai proses pembayaran Pi
      await window.Pi.createPayment(paymentData, callbacks);
    } catch (err) {
      console.error(err);
      setError('Gagal memulai SDK Pi. Pastikan Anda berada di Pi Browser.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Formulir Checkout</h2>
        
        {/* Rincian Produk */}
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

        {/* Form Alamat & Pengiriman */}
        <div className="flex flex-col gap-4">
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
            </select>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}

        {/* Tombol Aksi */}
        <div className="mt-6 flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="bg-slate-600 hover:bg-slate-500 px-6 py-2 rounded-lg">Batal</button>
          <button 
            type="button" 
            onClick={handlePiCheckout}
            disabled={isLoading || product.currency.toLowerCase() !== 'pi'}
            className="bg-tosca hover:bg-tosca-dark px-6 py-2 rounded-lg font-bold w-48 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Menunggu...' : `Bayar dengan Pi (π)`}
          </button>
        </div>
      </div>
    </div>
  );
}

