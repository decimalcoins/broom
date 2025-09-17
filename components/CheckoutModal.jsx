
'use client';

import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/PiContext';
import { GCV_IN_IDR } from '@/lib/constants';

const formatToIDR = (price) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

export default function CheckoutModal({ product, onClose }) {
  const { createPayment, isSdkReady } = useAppContext();

  const [address, setAddress] = useState('');
  const [shipping, setShipping] = useState('');
  const [proof, setProof] = useState(null);
  const [step, setStep] = useState('form'); // form | bank
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ==== Hitung Total ====
  const getShippingCost = (service) => {
    switch (service) {
      case 'jnt': return 18000;
      case 'jne_cargo': return 35000;
      case 'gosend': return 25000;
      default: return 0;
    }
  };

  const { totalIdr, totalPi } = useMemo(() => {
    const cost = getShippingCost(shipping);
    if (product.currency === 'idr') {
      return { totalIdr: product.price + cost, totalPi: (product.price + cost) / GCV_IN_IDR };
    }
    return { totalPi: product.price + cost / GCV_IN_IDR, totalIdr: product.price * GCV_IN_IDR + cost };
  }, [product, shipping]);

  // ==== Panggil API ke backend ====
  const sendCheckoutToServer = async (payload) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert('✅ ' + data.message);
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal mengirim ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==== Bayar dengan Pi ====
  const handlePiCheckout = async () => {
    if (!address || !shipping) return setError('Alamat & pengiriman wajib diisi.');
    setError('');
    setIsLoading(true);

    const paymentData = {
      amount: Number(totalPi.toFixed(6)),
      memo: `Pembelian: ${product.name}`,
      metadata: { productId: product.id, address, shipping, totalIdr, totalPi },
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId) =>
        sendCheckoutToServer({ paymentId, product, address, shipping }),
      onReadyForServerCompletion: (paymentId, txid) =>
        console.log('✅ Selesai di server', { paymentId, txid }),
      onCancel: () => setIsLoading(false),
      onError: (err) => {
        console.error(err);
        setError('Terjadi kesalahan dengan SDK Pi');
        setIsLoading(false);
      },
    };

    try {
      await createPayment(paymentData, callbacks);
    } catch (err) {
      console.error(err);
      setError('Tidak dapat memulai Pi SDK. Pastikan di Pi Browser.');
      setIsLoading(false);
    }
  };

  // ==== Transfer bank ====
  const handleBank = () => {
    if (!address || !shipping) return setError('Alamat & pengiriman wajib diisi.');
    if (!proof) return setError('Harap upload bukti transfer.');
    setError('');
    setIsLoading(true);
    sendCheckoutToServer({
      type: 'bank_transfer',
      product,
      address,
      shipping,
      totalIdr,
      totalPi,
      fileName: proof.name,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-xl w-full max-w-lg text-white">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        {/* Info produk */}
        <div className="flex gap-3 p-3 bg-slate-700 rounded">
          <img src={product.image} alt={product.name} className="w-20 h-20 rounded object-cover" />
          <div>
            <p className="font-semibold">{product.name}</p>
            <p className="text-slate-300">
              {product.currency === 'idr'
                ? formatToIDR(product.price)
                : `${product.price} π`}
            </p>
            <small>Total: {formatToIDR(totalIdr)} (~ π {totalPi.toFixed(6)})</small>
          </div>
        </div>

        {/* Alamat + Pengiriman */}
        {step === 'form' && (
          <div className="mt-4 space-y-3">
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat lengkap"
              className="w-full p-2 rounded bg-slate-700"
            />
            <select
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
              className="w-full p-2 rounded bg-slate-700"
            >
              <option value="">-- Pilih Pengiriman --</option>
              <option value="jnt">J&T (Rp 18.000)</option>
              <option value="jne_cargo">JNE Cargo (Rp 35.000)</option>
              <option value="gosend">GoSend (Rp 25.000)</option>
            </select>
          </div>
        )}

        {error && <p className="text-red-400 mt-3">{error}</p>}

        {/* Tombol */}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded">
            Batal
          </button>
          {product.currency === 'pi' ? (
            <button
              disabled={isLoading || !isSdkReady}
              onClick={handlePiCheckout}
              className="bg-green-600 px-4 py-2 rounded font-bold disabled:opacity-50"
            >
              {isLoading ? 'Memproses…' : `Bayar Pi (π ${totalPi.toFixed(6)})`}
            </button>
          ) : step === 'form' ? (
            <button onClick={() => setStep('bank')} className="bg-green-600 px-4 py-2 rounded font-bold">
              Lanjutkan
            </button>
          ) : (
            <button onClick={handleBank} disabled={isLoading} className="bg-green-600 px-4 py-2 rounded font-bold">
              {isLoading ? 'Mengirim…' : 'Konfirmasi'}
            </button>
          )}
        </div>

        {step === 'bank' && (
          <div className="mt-4">
            <p>Transfer ke: <b>SeaBank 1234567890 a.n Broom Admin</b></p>
            <input type="file" onChange={(e) => setProof(e.target.files[0])} className="mt-2 text-sm" />
          </div>
        )}
      </div>
    </div>
  );
}
