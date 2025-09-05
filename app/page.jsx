'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // <-- 1. Impor 'dynamic'
import Splash from '@/components/Splash';
import ProductCard from '@/components/ProductCard';
import ChatModal from '@/components/ChatModal';

// 2. Gunakan dynamic import untuk memuat modal hanya di sisi klien
const DynamicLoginModal = dynamic(() => import('@/components/LoginModal'), { 
  ssr: false, // <-- Ini adalah bagian terpenting: menonaktifkan Server-Side Rendering
  loading: () => <p className="text-center">Memuat modal...</p> // Tampilan loading opsional
});

const DynamicCheckoutModal = dynamic(() => import('@/components/CheckoutModal'), {
  ssr: false,
  loading: () => <p className="text-center">Memuat modal...</p>
});


export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // State baru untuk menyimpan data user
  const [user, setUser] = useState(null); 
  
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [chatProduct, setChatProduct] = useState(null);

  // Mengambil data produk dari API saat komponen dimuat
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Gagal mengambil data produk');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); 
    return () => clearTimeout(timer);
  }, []);

  // Diperbarui untuk menerima data user dari LoginModal
  const handleRoleSelected = (role, userData = null) => {
    if (role === 'admin') {
      window.location.href = '/admin';
      return;
    }
    // Simpan data user dan role ke state
    setUser({ role, ...userData });
    setShowModal(false);
  };
  
  const handleLogout = () => {
    setUser(null);
  };

  const handleBuy = (product) => {
    setCheckoutProduct(product); 
  };

  const handleChat = (product) => {
    setChatProduct(product);
  };

  // Diperbarui untuk menangani dua jenis checkout
  const handleCheckout = async (checkoutData) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      alert(result.message); // Menampilkan pesan sukses dari backend
      setCheckoutProduct(null);

    } catch (error) {
      console.error('Error saat checkout:', error);
      alert(`Error: ${error.message}`);
    }
  };
  
  const handleSendMessage = async (message) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, productId: chatProduct.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      // Pesan dikirim, tidak perlu alert di sini
      console.log(result.message);
    } catch (error) {
      console.error('Error saat mengirim pesan:', error);
    }
  };

  const renderContent = () => {
    if (user && user.role === 'user') {
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Produk untuk Anda</h2>
              {/* Menampilkan username jika ada */}
              {user.username && <p className="text-slate-400">Selamat datang, @{user.username}!</p>}
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Logout</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onBuy={handleBuy}
                  onChat={handleChat}
                  user={user.role}
                />
              ))
            ) : (
              <p>Memuat produk...</p>
            )}
          </div>
        </div>
      );
    }

    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-tosca">Selamat Datang di Broom Marketplace!</h2>
            <p className="text-slate-400 mt-2 mb-6">Silakan masuk untuk melihat produk.</p>
            <button 
                onClick={() => setShowModal(true)}
                className="bg-tosca hover:bg-tosca-dark text-white font-bold py-2 px-6 rounded-lg text-lg"
            >
                Masuk
            </button>
        </div>
    );
  };

  if (loading) {
    return <Splash />;
  }

  return (
    <main className="min-h-screen p-6">
      {showModal && (
        // 3. Render versi dinamis dari modal
        <DynamicLoginModal 
          onRoleSelected={handleRoleSelected}
          onCancel={() => setShowModal(false)}
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
        <ChatModal
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

