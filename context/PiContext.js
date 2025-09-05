'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import Script from 'next/script';

const PiContext = createContext();

export function PiProvider({ children }) {
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    window.handlePiSdkReady = () => {
      console.log("Pi SDK loaded, initializing...");
      window.Pi.init({ version: "2.0", sandbox: true }); 
      setIsSdkReady(true);
    };
    return () => { delete window.handlePiSdkReady; };
  }, []);

  // --- DIPERBARUI: Meminta semua izin di awal untuk stabilitas ---
  const authenticate = async () => {
    if (!isSdkReady) throw new Error("Pi SDK belum siap.");
    
    try {
      // Minta izin untuk username DAN pembayaran sekaligus.
      const scopes = ['username', 'payments'];
      
      const authResult = await window.Pi.authenticate(scopes, () => {});
      
      // Pengecekan keamanan jika pengguna membatalkan atau terjadi error.
      if (!authResult || !authResult.user) {
        throw new Error("Proses izin dibatalkan atau gagal mendapatkan data pengguna.");
      }
      
      const userData = {
        uid: authResult.user.uid,
        username: authResult.user.username,
        role: 'user',
      };
      setUser(userData);

      // Cek status admin ke backend
      try {
        const response = await fetch(`/api/admin?username=${userData.username}`);
        const data = await response.json();
        if (data.isAdmin) setIsAdmin(true);
        else setIsAdmin(false);
      } catch (error) {
        console.error("Gagal memeriksa status admin:", error);
      }
      
      return authResult;
    } catch (err) {
      // Lemparkan kembali error untuk ditangani oleh komponen pemanggil
      throw err;
    }
  };

  const createPayment = async (paymentData, callbacks) => {
    if (!isSdkReady) throw new Error("Pi SDK belum siap.");

    const fullCallbacks = {
        onReadyForServerApproval: () => {},
        onReadyForServerCompletion: () => {},
        onCancel: () => {},
        onError: () => {},
        ...callbacks
    };
    await window.Pi.createPayment(paymentData, fullCallbacks);
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };
  
  const value = useMemo(() => ({
    isSdkReady, user, isAdmin,
    authenticate, setIsAdmin, logout, createPayment
  }), [isSdkReady, user, isAdmin]);

  return (
    <PiContext.Provider value={value}>
      {children}
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="afterInteractive"
        onLoad={() => window.handlePiSdkReady && window.handlePiSdkReady()}
      />
    </PiContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(PiContext);
  if (!context) {
    throw new Error('useAppContext must be used within a PiProvider');
  }
  return context;
}

