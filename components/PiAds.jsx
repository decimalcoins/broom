'use client';
import { useState } from 'react';

export default function PiAds({ sellerId = 'seller_demo' }) {
  const [last, setLast] = useState(null);
  const simulateRevenue = async () => {
    // random small revenue
    const amount = Math.round((Math.random()*0.5 + 0.01) * 1000) / 1000;
    try {
      const res = await fetch('/api/ads/revenue', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount, sellerId })
      });
      const data = await res.json();
      setLast({ amount, data });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Pi Ads (Demo)</h3>
      <p className="text-sm text-gray-600 mb-2">Simulasikan pendapatan iklan untuk seller.</p>
      <div className="flex gap-2">
        <button onClick={simulateRevenue} className="px-3 py-2 bg-blue-600 text-white rounded">Simulate revenue</button>
        {last && <div className="ml-4 text-sm">Last: {last.amount} — resp: {JSON.stringify(last.data)}</div>}
      </div>
    </div>
  );
}
