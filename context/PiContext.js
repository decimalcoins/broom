'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import Script from 'next/script';

const PiContext = createContext();

export function PiProvider({ children }) {
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  // === Load user dari localStorage saat awal ===
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('broom_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setIsAdmin(parsed.role === 'admin');
        } catch (e) {
          console.warn('⚠️ Gagal parse user dari localStorage', e);
        }
      }
    }
  }, []);

  // === Init Pi SDK ===
  useEffect(() => {
    window.handlePiSdkReady = () => {
      console.log('✅ Pi SDK loaded, initializing...');
      if (window.Pi && typeof window.Pi.init === 'function') {
        window.Pi.init({
          version: '2.0',
          sandbox: process.env.NEXT_PUBLIC_PI_ENV === 'sandbox',
        });
        setIsSdkReady(true);
      } else {
        console.warn('⚠️ window.Pi tidak tersedia.');
      }
    };
    return () => delete window.handlePiSdkReady;
  }, []);

  // === Simpan user ke localStorage setiap kali berubah ===
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem('broom_user', JSON.stringify(user));
    }
  }, [user]);

  // === Login user ===
  const authenticate = async () => {
    console.log('👉 Klik login user');
    console.log('isSdkReady:', isSdkReady, 'window.Pi:', window.Pi);

    // fallback untuk dev (tanpa Pi Browser)
    if (!window.Pi) {
      console.warn('Pi SDK tidak tersedia, simulasi login.');
      const fake = { uid: 'local-1', username: 'tester', role: 'user' };
      setUser(fake);
      setIsAdmin(false);
      return fake;
    }

    if (!isSdkReady) throw new Error('Pi SDK belum siap.');

    const scopes = ['username', 'payments'];
    const onIncompletePaymentFound = (payment) =>
      console.log('Incomplete payment found', payment);

    const authResult = await window.Pi.authenticate(
      scopes,
      onIncompletePaymentFound
    );

    const userData = {
      uid: authResult.user.uid,
      username: authResult.user.username,
      role: 'user',
    };
    setUser(userData);
    setIsAdmin(false);
    return userData;
  };

  // === Upgrade Admin (bayar 0.001π) ===
  const upgradeToAdmin = () => {
    console.log('👉 Klik upgrade admin');
    console.log('isSdkReady:', isSdkReady, 'window.Pi:', window.Pi);

    // fallback saat bukan di Pi Browser
    if (!window.Pi) {
      console.warn('Pi SDK tidak ada, simulasi admin.');
      const adminUser = { uid: 'local-1', username: 'tester', role: 'admin' };
      setUser(adminUser);
      setIsAdmin(true);
      return Promise.resolve({ paymentId: 'simulated', txid: 'simulated' });
    }

    if (!isSdkReady) {
      return Promise.reject(new Error('Pi SDK belum siap.'));
    }

    const paymentData = {
      amount: 0.001,
      memo: 'Upgrade ke Admin di Broom Marketplace',
      metadata: { type: 'admin-upgrade' },
    };

    return new Promise((resolve, reject) => {
      window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId) =>
          console.log('Server approval needed:', paymentId),

        onReadyForServerCompletion: (paymentId, txid) => {
          console.log('✅ Pembayaran selesai', { paymentId, txid });
          const updated = { ...user, role: 'admin' };
          setUser(updated);
          setIsAdmin(true);
          setLastPayment({ paymentId, txid });
          resolve({ paymentId, txid });
        },

        onCancel: (paymentId) => {
          console.warn('❌ Pembayaran dibatalkan:', paymentId);
          reject(new Error('Pembayaran dibatalkan.'));
        },

        onError: (error, payment) => {
          console.error('⚠️ Payment error:', error, payment);
          reject(error);
        },
      });
    });
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setLastPayment(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('broom_user');
    }
  };

  // === Alias supaya konsisten dengan LoginModal.jsx ===
  const handleUserLogin = () => authenticate();
  const handleAdminLogin = () => upgradeToAdmin();

  const value = useMemo(
    () => ({
      isSdkReady,
      user,
      isAdmin,
      lastPayment,
      authenticate,
      upgradeToAdmin,
      handleUserLogin,
      handleAdminLogin,
      logout,
    }),
    [isSdkReady, user, isAdmin, lastPayment]
  );

  return (
    <PiContext.Provider value={value}>
      {children}
      <Script
        src="https://sdk.minepi.com/pi-sdk.js"
        strategy="afterInteractive"
        onLoad={() =>
          window.handlePiSdkReady && window.handlePiSdkReady()
        }
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
