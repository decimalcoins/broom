<<<<<<< HEAD
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
=======

'use client';

// 1. Import hook tambahan: useRef untuk referensi DOM, useEffect untuk side-effects
import { useState, useRef, useEffect } from 'react';

export default function ChatModal({ product, onSend, onCancel }) {
  const [message, setMessage] = useState('');
  // 2. State baru untuk melacak status pengiriman (loading)
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    // 3. Menggunakan ID unik untuk key, ini adalah best practice
    { id: 1, from: 'seller', text: `Halo! Ada yang bisa dibantu terkait produk "${product.name}"?` },
  ]);

  // 4. Membuat ref untuk elemen 'penanda' di akhir daftar pesan
  const messagesEndRef = useRef(null);

  // 5. Fungsi untuk auto-scroll ke bawah
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 6. useEffect yang akan berjalan setiap kali array 'messages' berubah
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSend = (e) => {
    e.preventDefault();
    // Jangan kirim jika input kosong atau sedang dalam proses pengiriman
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true); // Mulai loading

    // Tambahkan pesan baru dari user dengan ID unik
    const userMessage = { 
      id: Date.now(), // Gunakan timestamp sebagai ID unik sementara
      from: 'user', 
      text: message 
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Kirim pesan ke parent komponen
    onSend(message);
    
    // Kosongkan input
    setMessage('');
    
    // 7. Simulasi balasan dari penjual & menghentikan loading
    setTimeout(() => {
      const sellerReply = {
        id: Date.now() + 1, // Pastikan ID unik
        from: 'seller',
        text: 'Baik, terima kasih atas pertanyaannya. Akan segera kami cek.'
      };
      setMessages(prevMessages => [...prevMessages, sellerReply]);
      setIsLoading(false); // Selesai loading
    }, 1500); // Diberi jeda 1.5 detik
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-lg text-white flex flex-col h-[70vh]">
        <h2 className="text-xl font-bold mb-4 border-b border-slate-600 pb-3">Chat dengan Penjual</h2>
        <p className="text-sm text-slate-400 mb-4">Produk: <span className="font-semibold">{product.name}</span></p>

        {/* Area Pesan */}
        <div className="flex-grow space-y-4 overflow-y-auto pr-2">
          {/* 8. Menggunakan msg.id untuk key */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.from === 'user' ? 'bg-tosca text-black' : 'bg-slate-700'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {/* 9. Elemen 'penanda' untuk auto-scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Formulir Input Pesan */}
        <form onSubmit={handleSend} className="mt-4 flex gap-2 border-t border-slate-600 pt-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ketik pesan Anda..."
            // 10. Menonaktifkan input saat loading
            disabled={isLoading}
            className="flex-grow p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-tosca disabled:opacity-50"
          />
          <button 
            type="submit" 
            // 11. Menonaktifkan tombol & mengubah teks saat loading
            disabled={isLoading}
            className="bg-tosca hover:bg-tosca-dark px-6 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : 'Kirim'}
          </button>
        </form>
        <button onClick={onCancel} className="text-slate-400 hover:text-white text-center mt-4 text-sm">
          Tutup
        </button>
>>>>>>> 0751ac4dc29c6cc66cab38788480060f410e82ba
      </div>
    </div>
  );
}
