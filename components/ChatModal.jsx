"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatModal({ product, onSend, onCancel }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "system", text: "Halo! Ada yang bisa kami bantu tentang produk ini?" }
  ]);

  const endOfMessagesRef = useRef(null);

  // Scroll otomatis ke bawah setiap ada pesan baru
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    setIsLoading(true);
    const newMessage = { sender: "user", text: message };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Simulasi balasan bot
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Terima kasih atas pesan Anda! Kami akan segera merespons." },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-slate-800 rounded-lg w-96 p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-2">Chat dengan Penjual</h2>
        <div className="flex-1 overflow-y-auto bg-slate-700 p-2 rounded-md mb-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${
                msg.sender === "user"
                  ? "text-right text-blue-300"
                  : msg.sender === "bot"
                  ? "text-green-300"
                  : "text-gray-300"
              }`}
            >
              <span>{msg.text}</span>
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-md px-2 text-black"
            placeholder="Tulis pesan..."
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-white disabled:opacity-50"
          >
            {isLoading ? "..." : "Kirim"}
          </button>
        </div>
        <button
          onClick={onCancel}
          className="mt-2 text-red-400 hover:text-red-500 text-sm"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
