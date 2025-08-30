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

'use client';

import { useState } from 'react';

export default function ChatModal({ product, onSend, onCancel }) {
  const [message, setMessage] = useState('');
  // Pesan dummy untuk simulasi tampilan
  const [messages, setMessages] = useState([
    { from: 'seller', text: `Halo! Ada yang bisa dibantu terkait produk "${product.name}"?` },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Tambahkan pesan baru dari user ke daftar chat
    const newMessages = [...messages, { from: 'user', text: message }];
    setMessages(newMessages);
    
    // Kirim pesan ke parent komponen (untuk logika backend nanti)
    onSend(message);
    
    // Kosongkan input setelah pesan dikirim
    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-lg text-white flex flex-col h-[70vh]">
        <h2 className="text-xl font-bold mb-4 border-b border-slate-600 pb-3">Chat dengan Penjual</h2>
        <p className="text-sm text-slate-400 mb-4">Produk: <span className="font-semibold">{product.name}</span></p>

        {/* Area Pesan */}
        <div className="flex-grow space-y-4 overflow-y-auto pr-2">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.from === 'user' ? 'bg-tosca text-black' : 'bg-slate-700'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Formulir Input Pesan */}
        <form onSubmit={handleSend} className="mt-4 flex gap-2 border-t border-slate-600 pt-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ketik pesan Anda..."
            className="flex-grow p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-tosca"
          />
          <button type="submit" className="bg-tosca hover:bg-tosca-dark px-6 py-2 rounded-lg font-bold">Kirim</button>
        </form>
        <button onClick={onCancel} className="text-slate-400 hover:text-white text-center mt-4 text-sm">
          Tutup
        </button>
      </div>
    </div>
  );
}
