"use client";
import { useState } from "react";

export default function ChatModal({ open, product, onClose }) {
  const [msg, setMsg] = useState("");
  if (!open || !product) return null;

  const send = (e) => {
    e.preventDefault();
    if (msg.trim()) {
      alert(`Pesan terkirim: "${msg}"`);
      setMsg("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg m-4 text-white flex flex-col h-[70vh]">
        <div className="p-4 border-b border-slate-700 flex items-center">
          <img src={product.image} className="w-12 h-12 rounded-md object-cover" alt={product.name}/>
          <div className="ml-4">
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-slate-400">Chat dengan Penjual</p>
          </div>
          <button onClick={onClose} className="ml-auto text-2xl text-slate-500 hover:text-white">&times;</button>
        </div>
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          <div className="flex justify-end"><div className="bg-teal-600 p-3 rounded-lg max-w-xs">Apakah stoknya masih ada?</div></div>
          <div className="flex justify-start"><div className="bg-slate-700 p-3 rounded-lg max-w-xs">Masih, silakan diorder.</div></div>
        </div>
        <div className="p-4 border-t border-slate-700">
          <form onSubmit={send} className="flex space-x-2">
            <input value={msg} onChange={e=>setMsg(e.target.value)} type="text" placeholder="Ketik pesan..." className="w-full bg-slate-700 p-2 rounded-md border border-slate-600 focus:ring-teal-500"/>
            <button type="submit" className="bg-teal-500 px-4 rounded-md hover:bg-teal-600">Kirim</button>
          </form>
        </div>
      </div>
    </div>
  );
}
