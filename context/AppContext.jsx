"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { dummyProducts } from "@/lib/constants";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // { username }
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminProducts, setAdminProducts] = useState([]);
  const [sellerBankAccount, setSellerBankAccount] = useState({ number: '', name: '', piWallet: '' });

  const value = useMemo(() => ({
    user, setUser,
    isAdmin, setIsAdmin,
    adminProducts, setAdminProducts,
    sellerBankAccount, setSellerBankAccount,
    // derived
    allProducts: [...dummyProducts, ...adminProducts],
  }), [user, isAdmin, adminProducts, sellerBankAccount]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
