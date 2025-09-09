<<<<<<< HEAD
"use client";
import { useMemo, useState } from "react";
import { GCV_IN_IDR } from "@/lib/constants";

export default function CheckoutModal({ open, product, onClose, onConfirm }) {
  const [shippingCost, setShippingCost] = useState(0);
  if (!open || !product) return null;

  const { totalIdr, totalPi } = useMemo(() => {
    let tIdr, tPi;
    if (product.currency === 'idr') {
      tIdr = product.price + shippingCost;
      tPi = tIdr / GCV_IN_IDR;
    } else {
      tPi = product.price + (shippingCost / GCV_IN_IDR);
      tIdr = tPi * GCV_IN_IDR;
    }
    return { totalIdr: tIdr, totalPi: tPi };
  }, [product, shippingCost]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-3xl m-4 text-white">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Alamat Pengiriman</h3>
              <form className="space-y-3">
                <input type="text" placeholder="Nama Lengkap" className="w-full bg-slate-700 p-2 rounded-md border border-slate-600 focus:ring-teal-500"/>
                <textarea placeholder="Alamat Lengkap" rows={3} className="w-full bg-slate-700 p-2 rounded-md border border-slate-600 focus:ring-teal-500"/>
                <input type="text" placeholder="Kota/Kabupaten" className="w-full bg-slate-700 p-2 rounded-md border border-slate-600 focus:ring-teal-500"/>
              </form>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Jasa Pengiriman</h3>
              <div className="space-y-2">
                {[
                  { label: 'JNE (Reguler)', cost: 15000 },
                  { label: 'J&T (Express)', cost: 18000 },
                  { label: 'SiCepat (Cepat)', cost: 12000 },
                ].map(opt => (
                  <label key={opt.label} className="flex items-center p-3 bg-slate-700 rounded-md cursor-pointer hover:bg-slate-600">
                    <input type="radio" name="shipping" onChange={()=>setShippingCost(opt.cost)} />
                    <span className="ml-3">{opt.label}</span>
                    <span className="ml-auto font-semibold">{opt.cost.toLocaleString('id-ID', {style:'currency', currency:'IDR'})}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Metode Pembayaran</h3>
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-slate-700 rounded-md">
                  <svg className="w-5 h-5 text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                  <span className="ml-3 font-medium">Transfer Bank / Pi</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Ringkasan Pesanan</h3>
              <div className="bg-slate-700 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <img src={product.image} className="w-16 h-16 rounded-md object-cover" alt={product.name}/>
                  <div className="text-right">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-slate-400 text-sm">{product.currency === 'pi' ? 'π' : ''} {product.price.toLocaleString()}</p>
                  </div>
                </div>
                <hr className="border-slate-600"/>
                <div className="flex justify-between text-sm">
                  <p className="text-slate-400">Subtotal</p>
                  <p>{product.currency === 'pi' ? 'π' : ''} {product.price.toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-slate-400">Biaya Kirim</p>
                  <p>{shippingCost > 0 ? shippingCost.toLocaleString('id-ID', {style:'currency', currency:'IDR'}) : '-'}</p>
                </div>
                <hr className="border-slate-600"/>
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <div className="text-right">
                    <p className="text-teal-400">{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', minimumFractionDigits:0}).format(totalIdr)}</p>
                    <p className="text-xs text-slate-400">~ π {totalPi.toFixed(6)}</p>
                  </div>
                </div>
              </div>

              <button onClick={onConfirm} className="mt-6 w-full text-lg font-semibold text-white px-8 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:scale-105 transition-all">
                Konfirmasi Pembelian
              </button>
              <button onClick={onClose} className="text-sm text-slate-500 hover:text-white mt-4 w-full">Batal</button>
            </div>
          </div>
        </div>
=======
'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/PiContext';

// Fungsi untuk memformat angka ke Rupiah
const formatToIDR = (price) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(price);
};

export default function CheckoutModal({ product, onCheckout, onCancel }) {
  const { createPayment, isSdkReady } = useAppContext();
  const [address, setAddress] = useState('');
  const [shipping, setShipping] = useState('');
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStep, setPaymentStep] = useState('form');
  const [proof, setProof] = useState(null);
  
  // Efek untuk menghitung total harga untuk produk IDR
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
      setTotalPrice(product.price + cost);
    }
  }, [shipping, product.price, product.currency]);

  // Fungsi untuk menangani checkout dengan Pi
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
      // === PERBAIKAN: Menambahkan callback yang hilang ===
      onReadyForServerCompletion: (paymentId, txid) => {
        console.log('Pembayaran produk selesai di server', { paymentId, txid });
      },
      onCancel: () => setIsLoading(false),
      onError: (error) => {
        setError('Terjadi kesalahan dengan pembayaran Pi.');
        setIsLoading(false);
      },
    };

    try {
      await createPayment(paymentData, callbacks);
    } catch (err) {
      setError('Gagal memulai SDK Pi. Pastikan Anda di Pi Browser.');
      setIsLoading(false);
    }
  };

  // Fungsi untuk menangani konfirmasi transfer bank
  const handleBankConfirmation = () => {
    if (!proof) {
      setError('Harap unggah bukti pembayaran Anda.');
      return;
    }
    setError('');
    setIsLoading(true);
    onCheckout({
      type: 'bank_transfer',
      product,
      address,
      shipping,
      totalPrice,
      fileName: proof.name,
    });
  };

  const renderPaymentSection = () => {
    if (product.currency.toLowerCase() === 'pi') {
      return (
        <div className="mt-6 flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="bg-slate-600 hover:bg-slate-500 px-6 py-2 rounded-lg">Batal</button>
          <button 
            type="button" 
            onClick={handlePiCheckout}
            disabled={isLoading || !isSdkReady}
            className="bg-tosca hover:bg-tosca-dark px-6 py-2 rounded-lg font-bold w-48 disabled:opacity-50"
          >
            {isLoading ? 'Menunggu...' : `Bayar dengan Pi (π)`}
          </button>
        </div>
      );
    }

    if (product.currency.toLowerCase() === 'idr') {
      if (paymentStep === 'form') {
        return (
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onCancel} className="bg-slate-600 hover:bg-slate-500 px-6 py-2 rounded-lg">Batal</button>
            <button 
              type="button" 
              onClick={() => {
                if (!address || !shipping) {
                  setError('Harap isi alamat dan pilih layanan pengiriman.');
                  return;
                }
                setError('');
                setPaymentStep('confirmation');
              }}
              className="bg-tosca hover:bg-tosca-dark px-6 py-2 rounded-lg font-bold"
            >
              Lanjutkan ke Pembayaran
            </button>
          </div>
        );
      } else { // paymentStep === 'confirmation'
        return (
          <div className="mt-4 p-4 border-t border-slate-600 space-y-3">
            <p className="text-center text-slate-300">Silakan lakukan transfer ke rekening berikut:</p>
            <div className="bg-slate-900 p-4 rounded-lg text-center">
              <p className="text-lg font-semibold">Sea Bank</p>
              <p className="text-2xl font-mono tracking-widest my-1">1234567890</p>
              <p className="text-md">a.n. Broom Admin</p>
            </div>
            <div className="flex justify-between font-bold text-lg text-tosca mt-2 pt-2 border-t border-slate-700">
              <span>Total Pembayaran:</span>
              <span>{formatToIDR(totalPrice)}</span>
            </div>
            <div className="mt-2">
              <label className="block text-sm text-slate-400 mb-1">Unggah Bukti Pembayaran</label>
              <input 
                type="file" 
                onChange={(e) => setProof(e.target.files[0])}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tosca file:text-black hover:file:bg-tosca-dark"
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button type="button" onClick={() => setPaymentStep('form')} className="bg-slate-600 hover:bg-slate-500 px-6 py-2 rounded-lg">Kembali</button>
              <button 
                type="button" 
                onClick={handleBankConfirmation}
                disabled={isLoading}
                className="bg-tosca hover:bg-tosca-dark px-6 py-2 rounded-lg font-bold"
              >
                {isLoading ? 'Mengirim...' : 'Konfirmasi Pembayaran'}
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
        <h2 className="text-2xl font-bold mb-4">Formulir Checkout</h2>
        
        {paymentStep === 'form' ? (
          <>
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
          </>
        ) : null}

        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
        
        {renderPaymentSection()}
>>>>>>> 0751ac4dc29c6cc66cab38788480060f410e82ba
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> 0751ac4dc29c6cc66cab38788480060f410e82ba
