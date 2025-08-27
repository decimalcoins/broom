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
      </div>
    </div>
  );
}
