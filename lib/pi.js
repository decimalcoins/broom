// Variabel ini akan menyimpan objek Pi SDK setelah siap
let piSdk = null;

/**
 * Fungsi helper untuk mendapatkan objek Pi SDK secara aman.
 * Fungsi ini memastikan inisialisasi hanya dilakukan satu kali.
 */
export const getPiSdk = () => {
  // Jika kode berjalan di server (bukan di browser), Pi SDK tidak tersedia.
  if (typeof window === "undefined") {
    return null;
  }

  // Jika kita sudah punya objek SDK-nya, langsung kembalikan.
  if (piSdk) {
    return piSdk;
  }

  // Ambil objek Pi dari global 'window' yang dimuat oleh layout.jsx.
  const Pi = window.Pi;

  // Jika skrip Pi belum selesai dimuat, kembalikan null.
  if (!Pi) {
    return null;
  }
  
  // Inisialisasi SDK (hanya perlu dilakukan sekali).
  Pi.init({ version: "2.0", sandbox: true });

  // Simpan objeknya untuk pemanggilan berikutnya dan kembalikan.
  piSdk = Pi;
  return piSdk;
};