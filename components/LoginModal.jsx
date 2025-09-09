"use client";
import { useApp } from "@/context/AppContext";

export default function LoginModal({ onClose }) {
  const { handleUserLogin, handleAdminLogin } = useApp();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-slate-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Masuk Sebagai</h2>
        <button
          onClick={handleUserLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded mb-3"
        >
          User
        </button>
        <button
          onClick={handleAdminLogin}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded"
        >
          Admin (Bayar 0.001 π)
        </button>
        <button
          onClick={onClose}
          className="mt-4 text-gray-400 hover:underline w-full"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
