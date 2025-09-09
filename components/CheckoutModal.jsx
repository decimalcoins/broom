'use client';

import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/PiContext';
import { GCV_IN_IDR } from '@/lib/constants';

// Format ke Rupiah
const formatToIDR = (price) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

export default function CheckoutModal({ product, onCheckout, onCancel }) {
  const { createPayment, isSdkReady } = useAppContext();

  const [address, setAddress] = useState('');
  const [shipping, setShipping] = useState('');
  const [proof, setProof] = useState(null);
  const [paymentStep, setPaymentStep] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Ongkir berdasarkan pilihan
  const getShippingCost = (service) => {
    switch (service) {
      case 'jnt': return 18000;
      case 'jne_cargo': return 35000;
      case 'gosend': return 25000;
      default: return 0;
    }
  };

  // Hitung total
  const { totalIdr, totalPi } = useMemo(() => {
    let tIdr, tPi;
    if (product.currency === 'idr') {
      tIdr = product.price + getShippingCost(shipping);
      tPi = tIdr / GCV_IN_IDR;
    } else {
      tPi = product.price + getShippingCost(shipping) / GCV_IN_IDR;
      tIdr = tPi * GCV_IN_IDR;
    }
    return { totalIdr: tIdr, totalPi: tPi };
  }, [product, shipping]);

  // Checkout dengan Pi
  const handlePiCheckout = async () => {
    if (!address) {
      setError('Harap isi alamat lengkap.');
      return;
    }
    setError('');
    setIsLoading(true);

    const paymentData = {
      amount: Number(totalPi.toFixed(6)),
      memo: `Pembelian: ${product.name} + Ongkir`,
      metadata: { productId: product.id, address, shipping, totalIdr, totalPi },
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId) => onCheckout({ paymentId, product, address, shipping }),
      onReadyForServerCompletion: (paymentId, txid) =>
        console.log('Pembayaran produk selesai di server', { paymentId, txid }),
      onCancel: () => setIsLoading(false),
      onError: (err) => {
        console.error(err);
        setError('Terjadi kesalahan dengan pembayaran Pi.');
        setIsLoading(false);
      },
    };

    try {
      await createPayment(paymentData, callbacks);
    } catch (err) {
      console.error(err);
      setError('Gagal memulai SDK Pi. Pastikan Anda di Pi Browser.');
      setIsLoading(false);
    }
  };

  // Konfirmasi transfer bank (manual)
  const handleBankConfirmation = () => {
    if (!proof) {
      setError('Harap unggah bukti pembayaran.');
      return;
    }
    setError('');
    setIsLoading(true);
    onCheckout({
      type: 'bank_transfer',
      product,
      address,
      shipping,
      totalIdr,
      totalPi,
      fileName: proof.name,
    });
  };

  // Render tombol pembayaran
  const renderPaymentSection = () => {
    if (product.currency === 'pi') {
      return (
        <div className="mt-6 flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="bg-slate-600 px-6 py-2 rounded-lg">Batal</button>
          <button
            type="button"
            onClick={handlePiCheckout}
            disabled={isLoading || !isSdkReady}
            className="bg-green-600 px-6 py-2 rounded-lg font-bold disabled:opacity-50"
          >
            {isLoading ? 'Menunggu...' : `Bayar dengan Pi (π ${totalPi.toFixed(6)})`}
          </button>
        </div>
      );
    }

    if (product.currency === 'idr') {
      if (paymentStep === 'form') {
        return (
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onCancel} className="bg-slate-600 px-6 py-2 rounded-lg">Batal</button>
            <button
              type="button"
              onClick={() => {
                if (!address || !shipping) {
                  setError('Harap isi alamat & pilih pengiriman.');
                  return;
                }
                setError('');
                setPaymentStep('confirmation');
              }}
              className="bg-green-600 px-6 py-2 rounded-lg font-bold"
            >
              Lanjutkan
            </button>
          </div>
        );
      } else {
        return (
          <div className="mt-4 p-4 border-t border-slate-600 space-y-3">
            <p className="text-center text-slate-300">Transfer ke rekening berikut:</p>
            <div className="bg-slate-900 p-4 rounded-lg text-center">
              <p className="text-lg font-semibold">Sea Bank</p>
              <p className="text-2xl font-mono my-1">1234567890</p>
              <p className="text-md">a.n. Broom Admin</p>
            </div>
            <div className="flex justify-between font-bold text-lg text-green-400 mt-2">
              <span>Total:</span>
              <span>{formatToIDR(totalIdr)}</span>
            </div>
            <div className="mt-2">
              <label className="block text-sm text-slate-400 mb-1">Upload Bukti</label>
              <input
                type="file"
                onChange={(e) => setProof(e.target.files[0])}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-green-500 file:text-black hover:file:bg-green-600"
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button type="button" onClick={() => setPaymentStep('form')} className="bg-slate-600 px-6 py-2 rounded-lg">Kembali</button>
              <button
                type="button"
                onClick={handleBankConfirmation}
                disabled={isLoading}
                className="bg-green-600 px-6 py-2 rounded-lg font-bold"
              >
                {isLoading ? 'Mengirim...' : 'Konfirmasi'}
              </button>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        {/* Ringkasan Produk */}
        <div className="mb-6">
          <div className="flex items-start gap-4 p-4 bg-slate-700 rounded-lg">
            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-xl font-bold text-slate-300 mt-1">
                {product.currency === 'idr'
                  ? formatToIDR(product.price)
                  : `${product.price.toLocaleString()} π`}
              </p>
              <p className="text-sm text-slate-400">
                Total: {formatToIDR(totalIdr)} (~ π {totalPi.toFixed(6)})
              </p>
            </div>
          </div>
        </div>

        {/* Form alamat */}
        {paymentStep === 'form' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Alamat Lengkap</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Jl. Merdeka No. 123, Jakarta Pusat"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 h-24"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Jasa Pengiriman</label>
              <select
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
                className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              >
                <option value="">-- Pilih Pengiriman --</option>
                <option value="jnt">J&T Express (Rp 18.000)</option>
                <option value="jne_cargo">JNE Cargo (Rp 35.000)</option>
                <option value="gosend">GoSend Instant (Rp 25.000)</option>
              </select>
            </div>
          </div>
        )}

        {/* Error */}
        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}

        {/* Tombol / Konfirmasi */}
        {renderPaymentSection()}
      </div>
    </div>
  );
}
