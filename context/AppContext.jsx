"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { dummyProducts } from "@/lib/constants";

const PiContext = createContext(null);

export function PiProvider({ children }) {
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

  return <PiContext.Provider value={value}>{children}</PiContext.Provider>;
}

export function useApp() {
  const ctx = useContext(PiContext);
  if (!ctx) throw new Error("useApp must be used within PiProvider");
  return ctx;
}
