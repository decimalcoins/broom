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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // === BARU: State untuk menyimpan file bukti pembayaran ===
  const [paymentProof, setPaymentProof] = useState(null);

  // Efek untuk menghitung total harga (harga produk + ongkir) untuk produk IDR
  useEffect(() => {
    if (product.currency.toLowerCase() === 'idr') {
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
      setTotalPrice(product.price + cost);
    }
  }, [shipping, product.price, product.currency]);

  // Fungsi untuk menangani checkout dengan Pi (tetap sama)
  const handlePiCheckout = async () => {
    if (!address) {
      setError('Harap isi alamat lengkap.');
      return;
    }
    setError('');
    setIsLoading(true);

    const paymentData = {
      amount: Number(product.price),
      memo: `Pembelian: ${product.name}`,
      metadata: { productId: product.id, address, shipping },
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId) => onCheckout({ paymentId, product, address, shipping }),
      onCancel: () => setIsLoading(false),
      onError: (error) => {
        setError('Terjadi kesalahan dengan pembayaran Pi.');
        setIsLoading(false);
      },
    };

    try {
      await window.Pi.createPayment(paymentData, callbacks);
    } catch (err)
 {
      setError('Gagal memulai SDK Pi. Pastikan Anda di Pi Browser.');
      setIsLoading(false);
    }
  };

  // === BARU: Fungsi untuk menangani upload file bukti pembayaran ===
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2097152) { // Batas ukuran file 2MB
      setPaymentProof(file);
      setError('');
    } else if (file) {
      setPaymentProof(null);
      setError('Ukuran file maksimal 2MB.');
    }
  };

  // === BARU: Fungsi untuk mengirim konfirmasi pembayaran bank ===
  const handleBankConfirmation = () => {
    if (!address || !shipping) {
      setError('Harap isi alamat dan pilih layanan pengiriman.');
      return;
    }
    if (!paymentProof) {
      setError('Harap unggah bukti pembayaran.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulasi pengiriman data ke backend.
    // Di aplikasi nyata, Anda akan mengunggah file ini ke cloud storage
    // lalu mengirimkan URL file tersebut ke backend Anda.
    console.log("Mengirim konfirmasi pembayaran bank:", { paymentProof });
    onCheckout({
      type: 'bank_transfer', // Menandakan ini adalah pembayaran bank
      product,
      address,
      shipping,
      totalPrice,
      fileName: paymentProof.name 
    });
  };

  // === DIPERBARUI: Fungsi untuk menampilkan metode pembayaran yang sesuai ===
  const renderPaymentSection = () => {
    // Jika mata uang produk adalah 'pi'
    if (product.currency.toLowerCase() === 'pi') {
      return (
        <div className="mt-6 flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="bg-slate-600 hover:bg-slate-500 px-6 py-2 rounded-lg">Batal</button>
          <button 
            type="button" 
            onClick={handlePiCheckout}
            disabled={isLoading}
            className="bg-tosca hover:bg-tosca-dark px-6 py-2 rounded-lg font-bold w-48 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Menunggu...' : `Bayar dengan Pi (π)`}
          </button>
        </div>
      );
    }

    // Jika mata uang produk adalah 'idr'
    if (product.currency.toLowerCase() === 'idr') {
      return (
        <div className="mt-4 p-4 border-t border-slate-600 space-y-3">
          <p className="text-center text-slate-300">Silakan lakukan transfer ke rekening berikut:</p>
          <div className="bg-slate-900 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold">Bank BCA</p>
            <p className="text-2xl font-mono tracking-widest my-1">1234567890</p>
            <p className="text-md">a.n. Broom Admin</p>
          </div>
          <div className="flex justify-between font-bold text-lg text-tosca mt-2 pt-2 border-t border-slate-700">
            <span>Total Pembayaran:</span>
            <span>{formatToIDR(totalPrice)}</span>
          </div>
          
          {/* Form Upload Bukti Pembayaran */}
          <div className="mt-4">
            <label className="block text-sm text-slate-400 mb-1">Unggah Bukti Pembayaran (Max 2MB)</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tosca file:text-black hover:file:bg-tosca-dark"
            />
            {paymentProof && <p className="text-xs text-slate-400 mt-1">File dipilih: {paymentProof.name}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onCancel} className="bg-slate-600 hover:bg-slate-500 px-6 py-2 rounded-lg">Batal</button>
            <button 
              type="button" 
              onClick={handleBankConfirmation}
              disabled={isLoading}
              className="bg-tosca hover:bg-tosca-dark px-6 py-2 rounded-lg font-bold w-48 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Mengirim...' : 'Konfirmasi Pembayaran'}
            </button>
          </div>
        </div>
      );
    }

    return null; // Tidak menampilkan apa-apa jika mata uang tidak dikenali
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
          {/* Hanya tampilkan pilihan ongkir untuk produk IDR */}
          {product.currency.toLowerCase() === 'idr' && (
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
          )}
        </div>

        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
        
        {/* Memanggil fungsi untuk menampilkan metode pembayaran yang sesuai */}
        {renderPaymentSection()}
      </div>
    </div>
  );
}

