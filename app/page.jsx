'use client';

import { useState, useEffect } from 'react';
import LoginModal from '@/components/LoginModal';
import Splash from '@/components/Splash';
import ProductCard from '@/components/ProductCard';
import CheckoutModal from '@/components/CheckoutModal';
import ChatModal from '@/components/ChatModal';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState(null);
  const [products, setProducts] = useState([]);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [chatProduct, setChatProduct] = useState(null);
  const [piUser, setPiUser] = useState(null);

  // Mengambil data produk dari backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      }
    };
    fetchProducts();
  }, []);
  
  // Efek untuk splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowModal(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelected = (selectedRole, userData = null) => {
    setRole(selectedRole);
    setShowModal(false);
    if (userData) {
      setPiUser(userData);
    }
    if (selectedRole === 'admin') {
      window.location.href = '/admin';
    }
  };
  
  const handleLogout = () => {
    setRole(null);
    setPiUser(null);
    setShowModal(true);
  };

  const handleBuy = (product) => {
    setCheckoutProduct(product); 
  };

  const handleChat = (product) => {
    setChatProduct(product);
  };

  // === DIPERBARUI: Fungsi ini sekarang menangani semua jenis checkout ===
  const handleCheckout = async (checkoutData) => {
    try {
      // Data checkout (baik dari Pi maupun bank) langsung dikirim ke backend
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // Menampilkan pesan sukses dari backend
        setCheckoutProduct(null); // Tutup modal
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Gagal mengirim data checkout:", error);
      alert("Terjadi kesalahan koneksi.");
    }
  };
  
  const handleSendMessage = async (message) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, productId: chatProduct.id }),
      });
      if (!response.ok) throw new Error("Gagal mengirim pesan");
    } catch (error) {
      console.error(error);
    }
  };

  const renderContent = () => {
    if (role === 'user') {
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {piUser ? `Selamat datang, @${piUser.username}!` : 'Produk untuk Anda'}
            </h2>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Logout</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onBuy={handleBuy}
                onChat={handleChat}
                user={role}
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
        <LoginModal 
          onRoleSelected={handleRoleSelected}
          onCancel={() => setShowModal(false)}
        />
      )}
      
      {checkoutProduct && (
        <CheckoutModal
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

