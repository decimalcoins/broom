
"use client";

import { useAppContext } from "@/context/PiContext";

export default function LoginModal({ onClose }) {
  const { handleUserLogin, handleAdminLogin, user, isAdmin, isSdkReady } =
    useAppContext();

  const onUserClick = async () => {
    console.log("🔵 [LoginModal] Tombol User diklik");
    try {
      await handleUserLogin();
      console.log("✅ [LoginModal] Selesai login user", user);
      onClose?.();           // ✅ Tutup modal setelah sukses login user
    } catch (err) {
      console.error("❌ [LoginModal] Gagal login user:", err);
    }
  };

  const onAdminClick = async () => {
    console.log("🟣 [LoginModal] Tombol Admin diklik");
    try {
      await handleAdminLogin();
      console.log("✅ [LoginModal] Selesai upgrade admin", { user, isAdmin });
      onClose?.();           // ✅ Tutup modal setelah upgrade admin
    } catch (err) {
      console.error("❌ [LoginModal] Gagal upgrade admin:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-slate-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Masuk Sebagai</h2>

        <button
          onClick={onUserClick}
          disabled={!isSdkReady}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded mb-3 disabled:opacity-50"
        >
          User
        </button>

        <button
          onClick={onAdminClick}
          disabled={!isSdkReady}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded disabled:opacity-50"
        >
          Admin (Bayar 0.001 π)
        </button>

        <button
          onClick={onClose}
          className="mt-4 text-gray-400 hover:underline w-full"
        >
          Batal
        </button>

        <p className="mt-3 text-xs text-gray-400">
          SDK Ready: {isSdkReady ? "✅" : "❌"} | User:{" "}
          {user ? JSON.stringify(user) : "-"} | Admin:{" "}
          {isAdmin ? "✅" : "❌"}
        </p>
      </div>
    </div>
  );
}
