"use client";
import { useApp } from "@/context/AppContext";

export default function LoginModal({ open, onClose }) {
  const { setUser, setIsAdmin } = useApp();
  if (!open) return null;

  const login = (role) => {
    const isSeller = role === 'seller';
    setUser({ username: isSeller ? 'admin001' : 'user789' });
    setIsAdmin(isSeller);
    onClose(isSeller ? "/payment" : null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl text-center w-full max-w-md m-4">
        <h2 className="text-2xl font-bold text-white">Masuk Sebagai</h2>
        <p className="text-slate-400 mt-2 mb-8">Pilih peran Anda di Broom Marketplace.</p>
        <div className="space-y-4">
          <button onClick={()=>login('buyer')} className="w-full flex items-center text-left p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <span className="text-emerald-400"><svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg></span>
            <div className="ml-4">
              <p className="font-semibold text-white">User</p>
              <p className="text-sm text-slate-400">Masuk untuk melihat dan membeli produk.</p>
            </div>
          </button>
          <button onClick={()=>login('seller')} className="w-full flex items-center text-left p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <span className="text-emerald-400"><svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>
            <div className="ml-4">
              <p className="font-semibold text-white">Admin</p>
              <p className="text-sm text-slate-400">Masuk untuk mengelola produk dan toko.</p>
            </div>
          </button>
        </div>
        <button onClick={()=>onClose(null)} className="text-sm text-slate-500 hover:text-white mt-8">Batal</button>
      </div>
    </div>
  );
}
