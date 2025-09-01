'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppContext } from '@/context/PiContext'; // <-- 1. Impor hook useAppContext
import Splash from '@/components/Splash';
import ProductCard from '@/components/ProductCard';

// Gunakan dynamic import untuk memuat modal hanya di sisi klien
const DynamicLoginModal = dynamic(() => import('@/components/LoginModal'), { ssr: false });
const DynamicCheckoutModal = dynamic(() => import('@/components/CheckoutModal'), { ssr: false });
const DynamicChatModal = dynamic(() => import('@/components/ChatModal'), { ssr: false });


export default function HomePage() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [products, setProducts] = useState([]);
  
  // 2. Dapatkan state dan fungsi dari context
  const { user, logout } = useAppContext(); 
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [chatProduct, setChatProduct] = useState(null);

  // Mengambil data produk dari API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
      }
    };
    fetchProducts();
  }, []);

  // Timer untuk splash screen
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 3000); 
    return () => clearTimeout(timer);
  }, []);
  
  // 3. Fungsi handleRoleSelected sekarang jauh lebih sederhana
  // Karena state user sudah diatur di dalam context, kita hanya perlu menutup modal
  const handleRoleSelected = (role, userData) => {
    // Logika untuk menyimpan user sudah ditangani oleh 'authenticate' di dalam context
    // Logika untuk admin juga sudah ditangani di dalam LoginModal
    setShowLoginModal(false);
    if (role === 'admin') {
      // Redirect ke halaman admin jika rolenya admin
      window.location.href = '/admin';
    }
  };

  const handleBuy = (product) => {
    setCheckoutProduct(product); 
  };

  const handleChat = (product) => {
    setChatProduct(product);
  };

  const handleCheckout = async (checkoutData) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      alert(result.message);
      setCheckoutProduct(null);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  
  const handleSendMessage = async (message) => {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, productId: chatProduct.id }),
      });
    } catch (error) {
      console.error('Error saat mengirim pesan:', error);
    }
  };

  const renderContent = () => {
    // 4. Gunakan 'user' dari context untuk menentukan apa yang ditampilkan
    if (user) { 
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Produk untuk Anda</h2>
              <p className="text-slate-400">Selamat datang, @{user.username}!</p>
            </div>
            {/* 5. Gunakan fungsi 'logout' dari context */}
            <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Logout</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onBuy={handleBuy}
                onChat={handleChat}
                user={user.role}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-tosca">Selamat Datang di Broom Marketplace!</h2>
            <p className="text-slate-400 mt-2 mb-6">Silakan masuk untuk melihat produk.</p>
            <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-tosca hover:bg-tosca-dark text-white font-bold py-2 px-6 rounded-lg text-lg"
            >
                Masuk
            </button>
        </div>
    );
  };

  if (initialLoading) {
    return <Splash />;
  }

  return (
    <main className="min-h-screen p-6">
      {showLoginModal && (
        <DynamicLoginModal 
          onRoleSelected={handleRoleSelected}
          onCancel={() => setShowLoginModal(false)}
        />
      )}
      
      {checkoutProduct && (
        <DynamicCheckoutModal
            product={checkoutProduct}
            onCheckout={handleCheckout}
            onCancel={() => setCheckoutProduct(null)}
        />
      )}

      {chatProduct && (
        <DynamicChatModal
            product={chatProduct}
            onSend={handleSendMessage}
            onCancel={() => setChatProduct(null)}
        />
      )}
      
      <div className="mt-10">
        {renderContent()}
      </div>
    </main>
  );
}

