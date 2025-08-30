import Script from 'next/script';
import './globals.css';
import Footer from '@/components/Footer'; // <-- Mengimpor Footer

export const metadata = {
  title: "Broom Marketplace",
  description: "Marketplace demo powered by Next.js + Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* Menambahkan class untuk layout dan latar belakang */}
      <body className="min-h-screen text-white bg-slate-900 flex flex-col">
        {/* Wrapper ini memastikan footer menempel di bawah */}
        <div className="flex-grow">
          {children}
        </div>
        
        <Footer /> {/* <-- Menampilkan komponen Footer di sini */}

        {/* Skrip untuk memuat dan menginisialisasi Pi Network SDK */}
        <Script 
          src="https://sdk.minepi.com/pi-sdk.js" 
          strategy="beforeInteractive" 
        />
        <Script id="pi-init" strategy="afterInteractive">
          {`
            // Pengecekan keamanan untuk memastikan window.Pi ada sebelum dijalankan
            if (window.Pi) {
              window.Pi.init({ version: "2.0", sandbox: true });
            }
          `}
        </Script>
      </body>
    </html>
  );
}