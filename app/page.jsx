'use client';

import { useState, useEffect } from 'react';
import LoginModal from '@/components/LoginModal';
import Splash from '@/components/Splash';
import ProductCard from '@/components/ProductCard';
import CheckoutModal from '@/components/CheckoutModal';
import ChatModal from '@/components/ChatModal';
import { dummyProducts } from '@/lib/constants';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState(null);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [chatProduct, setChatProduct] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowModal(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelected = (selectedRole) => {
    setRole(selectedRole);
    setShowModal(false);
    if (selectedRole === 'admin') {
      window.location.href = '/admin';
    }
  };
  
  const handleLogout = () => {
    setRole(null);
    setShowModal(true);
  };

  const handleBuy = (product) => {
    setCheckoutProduct(product); 
  };

  const handleChat = (product) => {
    setChatProduct(product);
  };

  const handleCheckout = (checkoutData) => {
    alert(`Memproses pembelian ${checkoutData.product.name} ke alamat ${checkoutData.address}...`);
    setCheckoutProduct(null);
  };
  
  const handleSendMessage = (message) => {
    alert(`Pesan terkirim: "${message}"\n(Ini adalah simulasi, pesan tidak benar-benar dikirim)`);
  };

  const renderContent = () => {
    if (role === 'user') {
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Produk untuk Anda</h2>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Logout</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dummyProducts.map(product => (
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
            {/* PERUBAHAN: Menambahkan class 'text-tosca' */}
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


