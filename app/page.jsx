"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import LoginModal from "@/components/LoginModal";
import CheckoutModal from "@/components/CheckoutModal";
import ChatModal from "@/components/ChatModal";
import Splash from "@/components/Splash";
import { useApp } from "@/context/AppContext";

export default function HomePage() {
  const router = useRouter();
  const { user, isAdmin, allProducts, adminProducts, setAdminProducts } = useApp();
  const [filter, setFilter] = useState("Semua");
  const [showSplash, setShowSplash] = useState(true);
  const [openLogin, setOpenLogin] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [productToCheckout, setProductToCheckout] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [productToChat, setProductToChat] = useState(null);

  useEffect(() => {
    const timer = setTimeout(()=>setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(()=>['Semua','Kebutuhan Pokok','Elektronik','Kendaraan','Aksesoris','Toys','Fashion'],[]);
  const filteredProducts = useMemo(
    () => allProducts.filter(p => filter === 'Semua' || p.category === filter),
    [allProducts, filter]
  );

  const onBuy = (product) => {
    if (!user) { setOpenLogin(true); return; }
    setProductToCheckout(product);
    setOpenCheckout(true);
  };
  const onChat = (product) => { setProductToChat(product); setOpenChat(true); };

  const onCloseLogin = (to) => {
    setOpenLogin(false);
    if (to) router.push(to);
  };

  const onConfirmPurchase = () => {
    // decrement stock from admin or dummy array clone (adminProducts only, dummy is immutable here)
    setAdminProducts(prev => prev.map(p => p.id === productToCheckout.id ? { ...p, stock: Math.max(0, (p.stock || 0) - 1) } : p));
    alert(`Pembelian ${productToCheckout.name} berhasil! Silakan lanjutkan pembayaran via Transfer.`);
    setOpenCheckout(false);
    setProductToCheckout(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showSplash && <Splash />}
      <Navbar onOpenLogin={()=>setOpenLogin(true)} />

      <main className="max-w-7xl mx-auto p-4 md:p-8 flex-1">
        <div className="text-center md:text-left mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Katalog Produk</h1>
          <p className="text-slate-400 mt-2">Temukan semua yang Anda butuhkan di sini.</p>
        </div>

        {user && !isAdmin && (
          <div className="bg-slate-800 p-4 rounded-lg mb-8 flex items-center justify-between flex-wrap gap-4">
            <p className="text-white font-medium">Ingin menjual produk Anda? Aktifkan akun penjual sekarang!</p>
            <button onClick={()=>router.push('/payment')} className="bg-teal-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-teal-600 transition-colors text-sm">Aktivasi Akun</button>
          </div>
        )}

        <div className="flex justify-center md:justify-start flex-wrap gap-2 md:gap-4 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={()=>setFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === cat ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} onBuy={onBuy} onChat={onChat} user={user}/>
          )) : <p className="text-slate-400 col-span-full">Tidak ada produk untuk kategori ini.</p>}
        </div>
      </main>

      <Footer />

      <LoginModal open={openLogin} onClose={onCloseLogin} />
      <CheckoutModal open={openCheckout} product={productToCheckout} onClose={()=>setOpenCheckout(false)} onConfirm={onConfirmPurchase} />
      <ChatModal open={openChat} product={productToChat} onClose={()=>setOpenChat(false)} />
    </div>
  );
}
