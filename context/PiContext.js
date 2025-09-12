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
      window.Pi.init({ version: "2.0", sandbox: process.env.NEXT_PUBLIC_PI_ENV === "sandbox" });
      setIsSdkReady(true);
    };
    return () => { delete window.handlePiSdkReady; };
  }, []);

  // === Login ===
  const authenticate = async () => {
    if (!isSdkReady) throw new Error("Pi SDK belum siap.");
    const scopes = ['username', 'payments']; // ✅ penting untuk transaksi
    const onIncompletePaymentFound = (payment) => {
      console.log("Incomplete payment found", payment);
    };
    const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);

    const userData = {
      uid: authResult.user.uid,
      username: authResult.user.username,
      role: 'user',
    };
    setUser(userData);
    return userData;
  };

  // === Admin Upgrade (bayar 0.001π) ===
  const upgradeToAdmin = async () => {
    if (!isSdkReady) throw new Error("Pi SDK belum siap.");
    const paymentData = {
      amount: 0.001,
      memo: "Upgrade ke Admin di Broom Marketplace",
      metadata: { type: "admin-upgrade" },
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId) => {
        console.log("Server approval needed:", paymentId);
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        console.log("Server completion needed:", paymentId, txid);
        setIsAdmin(true);
      },
      onCancel: (paymentId) => {
        console.warn("Payment cancelled:", paymentId);
      },
      onError: (error, payment) => {
        console.error("Payment error:", error, payment);
      },
    };

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
    upgradeToAdmin, // ✅ khusus admin
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

export function useApp() {
  const context = useContext(PiContext);
  if (!context) {
    throw new Error('useAppContext must be used within a PiProvider');
  }
  return context;
}
