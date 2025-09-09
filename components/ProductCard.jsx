<<<<<<< HEAD
"use client";
import Image from "next/image";
import { GCV_IN_IDR } from "@/lib/constants";

const chatIcon = (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>);

export default function ProductCard({ product, onBuy, onChat, user }) {
  let primaryPrice, secondaryPrice;
  if (product.currency === 'idr') {
    primaryPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price);
    secondaryPrice = `π ${(product.price / GCV_IN_IDR).toFixed(6)}`;
  } else {
    primaryPrice = `π ${product.price.toLocaleString()}`;
    secondaryPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price * GCV_IN_IDR);
  }

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Using next/image would require remotePatterns; we added it in next.config. */}
      <img src={product.image} alt={product.name} className="h-48 w-full object-cover" onError={(e)=>{e.currentTarget.src='https://placehold.co/400x400/ef4444/ffffff?text=Error'}}/>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-white">{product.name}</h3>
        <p className="text-sm text-slate-400 mt-1">{product.category}</p>
        <div className="mt-4 flex items-center justify-between mt-auto">
          <div>
            <p className="text-xl font-semibold text-teal-400">{primaryPrice}</p>
            <p className="text-xs text-slate-500">~ {secondaryPrice}</p>
          </div>
          <div className="flex items-center space-x-2">
            {user && (
              <button onClick={()=>onChat(product)} className="bg-slate-600 text-white p-2 rounded-lg text-sm hover:bg-slate-500 transition-colors" aria-label="Chat">
                {chatIcon}
              </button>
            )}
            {product.stock > 0 ? (
              <button onClick={()=>onBuy(product)} className="bg-slate-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-600 transition-colors">Beli</button>
            ) : (
              <button disabled className="bg-red-800 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed">Stok Habis</button>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">Stok: {product.stock}</p>
      </div>
=======
'use client';

// Fungsi untuk memformat angka ke Rupiah
const formatToIDR = (price) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(price);
};

export default function ProductCard({ product, onBuy, onChat, user }) {
  const isPiProduct = product.currency.toLowerCase() === 'pi';

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover"/>
      
      {/* Konten diperbarui untuk menyertakan deskripsi */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white">{product.name}</h3>
        
        {/* === BARU: Menampilkan deskripsi produk === */}
        <p className="text-sm text-slate-400 mt-1 flex-grow">
          {product.description}
        </p>
        
        <div className="mt-4">
          <p className="text-xl font-bold text-tosca">
            {isPiProduct 
              ? `${product.price.toLocaleString()} π`
              : formatToIDR(product.price)
            }
          </p>
        </div>
      </div>
      
      {/* Tombol Aksi */}
      {user === 'user' && (
        <div className="p-4 bg-slate-900/50 flex gap-2">
          <button 
            onClick={() => onBuy(product)}
            className="flex-1 bg-tosca hover:bg-tosca-dark text-black font-bold py-2 px-4 rounded"
          >
            Beli
          </button>
          <button 
            onClick={() => onChat(product)}
            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
          >
            Chat
          </button>
        </div>
      )}
>>>>>>> 0751ac4dc29c6cc66cab38788480060f410e82ba
    </div>
  );
}
