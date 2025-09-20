"use client";

import { useState } from "react";
import { useAppContext } from "@/context/PiContext";

export default function LoginModal({ onClose, onRoleSelected }) {
  const { handleUserLogin, handleAdminLogin, user, isAdmin, isSdkReady } =
    useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // === Login sebagai User ===
  const onUserClick = async () => {
    setError("");
    setLoading(true);
    try {
      const u = await handleUserLogin();
      console.log("✅ [LoginModal] User login sukses:", u);
      onRoleSelected?.("user", u);
      onClose?.();
    } catch (err) {
      console.error("❌ [LoginModal] Gagal login user:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // === Upgrade jadi Admin (bayar 0.001π) ===
  const onAdminClick = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await handleAdminLogin(); // ← return {paymentId, txid}
      console.log("✅ [LoginModal] Admin sukses:", result);
      onRoleSelected?.("admin", { ...user, role: "admin" });
      onClose?.();
    } catch (err) {
      console.error("❌ [LoginModal] Upgrade admin gagal:", err);
      setError(err.message || "Gagal upgrade admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">
          Masuk / Upgrade Akun
        </h2>

        <button
          onClick={onUserClick}
          disabled={!isSdkReady || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded mb-3 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Masuk sebagai User"}
        </button>

        <button
          onClick={onAdminClick}
          disabled={!isSdkReady || loading}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Upgrade jadi Admin (0.001π)"}
        </button>

        {error && (
          <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-gray-400 hover:underline w-full"
        >
          Batal
        </button>

        <p className="mt-3 text-xs text-gray-400 text-center">
          SDK: {isSdkReady ? "✅" : "❌"} |{" "}
          {user ? `User: ${user.username}` : "Belum login"} |{" "}
          {isAdmin ? "Admin ✅" : "Bukan admin"}
        </p>
      </div>
    </div>
  );
}
