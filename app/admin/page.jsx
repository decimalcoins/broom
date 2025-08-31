'use client';

import AdminDashboard from "@/components/AdminDashboard";

// Halaman ini adalah wadah untuk dasbor admin.
export default function AdminPage() {

  const handleLogout = () => {
    // Saat admin logout, arahkan mereka kembali ke halaman utama.
    window.location.href = '/';
  };

  return (
    <main className="min-h-screen p-6 bg-slate-900">
       {/* Komponen AdminDashboard yang sebenarnya ditampilkan di sini */}
       <AdminDashboard onLogout={handleLogout} />
    </main>
  );
}


