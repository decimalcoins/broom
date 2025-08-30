"use client";
import { GCV_IN_IDR } from "@/lib/constants";

const chatIcon = (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>);

export default function ProductCard({ product, onBuy, onChat, user }) {
  let primaryPrice, secondaryPrice;
  
  // Menentukan harga utama dan sekunder berdasarkan mata uang produk
  if (product.currency === 'idr') {
    primaryPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price);
    secondaryPrice = `π ${(product.price / GCV_IN_IDR).toFixed(8)}`;
  } else {
    primaryPrice = `π ${product.price.toLocaleString()}`;
    secondaryPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price * GCV_IN_IDR);
  }

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex flex-col border border-slate-700">
      <img src={product.image} alt={product.name} className="h-48 w-full object-cover" onError={(e)=>{e.currentTarget.src='https://placehold.co/400x400/ef4444/ffffff?text=Error'}}/>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-white truncate">{product.name}</h3>
        <p className="text-sm text-slate-400 mt-1 capitalize">{product.category}</p>
        <div className="mt-4 flex items-center justify-between mt-auto">
          <div>
            <p className={`text-xl font-semibold ${product.currency === 'pi' ? 'text-tosca' : 'text-green-400'}`}>{primaryPrice}</p>
            <p className="text-xs text-slate-500">~ {secondaryPrice}</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Tombol chat hanya muncul jika user sudah login */}
            {user && (
              <button onClick={()=>onChat(product)} className="bg-slate-600 text-white p-2 rounded-lg text-sm hover:bg-slate-500 transition-colors" aria-label="Chat">
                {chatIcon}
              </button>
            )}
            {/* Tombol Beli atau Stok Habis */}
            {product.stock > 0 ? (
              <button onClick={()=>onBuy(product)} className="bg-tosca text-black px-4 py-2 rounded-lg text-sm hover:bg-tosca-dark transition-colors font-bold">Beli</button>
            ) : (
              <button disabled className="bg-red-800 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed">Stok Habis</button>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">Stok: {product.stock}</p>
      </div>
    </div>
  );
}

