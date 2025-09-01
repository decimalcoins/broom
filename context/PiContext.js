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

  const authenticate = async () => {
    if (!isSdkReady) throw new Error("Pi SDK belum siap.");
    const scopes = ['username'];
    const onIncompletePaymentFound = () => {}; 
    const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    const userData = {
      uid: authResult.user.uid,
      username: authResult.user.username,
      role: 'user',
    };
    setUser(userData);
    return userData;
  };

  // === BARU: Menambahkan fungsi createPayment ke Context ===
  const createPayment = async (paymentData, callbacks) => {
    if (!isSdkReady) {
      throw new Error("Pi SDK is not ready yet.");
    }
    // Langsung memanggil window.Pi.createPayment dari sini
    await window.Pi.createPayment(paymentData, callbacks);
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };
  
  const value = useMemo(() => ({
    isSdkReady,
    user,
    isAdmin,
    authenticate,
    createPayment, // <-- Menyertakan fungsi baru
    setIsAdmin,
    logout
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

