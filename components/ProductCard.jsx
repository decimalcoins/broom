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
    </div>
  );
}
