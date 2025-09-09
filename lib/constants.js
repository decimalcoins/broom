// Global Conversion Values (GCV)
// 1 Pi = 314,159 USD
export const GCV_USD = 314159;
// 1 USD = 16,000 IDR
export const USD_TO_IDR = 16000;
// Nilai tukar 1 Pi ke IDR
export const GCV_IN_IDR = GCV_USD * USD_TO_IDR;

// === CATATAN PENTING ===
// Harga dalam Pi (π) di bawah ini telah dihitung ulang agar realistis 
// dan konsisten dengan harga IDR berdasarkan GCV di atas.

// Dummy products (mix IDR and Pi)
export const dummyProducts = [
  { id: 1, name: 'Beras Premium 5kg', price: 65000, currency: 'idr', description: 'Beras pulen berkualitas tinggi untuk kebutuhan pokok keluarga.', image: 'https://placehold.co/400x400/22c55e/ffffff?text=Beras' },
  // Harga Smartphone Canggih (setara ~Rp 3.5jt)
  { id: 2, name: 'Smartphone Canggih', price: 0.0007, currency: 'pi', description: 'Smartphone terbaru dengan kamera jernih dan performa cepat.', image: 'https://placehold.co/400x400/3b82f6/ffffff?text=Smartphone' },
  { id: 3, name: 'Minyak Goreng 2L', price: 32000, currency: 'idr', description: 'Minyak goreng kelapa sawit, jernih dan sehat untuk masakan.', image: 'https://placehold.co/400x400/f97316/ffffff?text=Minyak' },
  // Harga Headphone Wireless (setara ~Rp 350rb)
  { id: 4, name: 'Headphone Wireless', price: 0.00007, currency: 'pi', description: 'Nikmati musik tanpa kabel dengan kualitas suara bass yang mendalam.', image: 'https://placehold.co/400x400/8b5cf6/ffffff?text=Headphone' },
  // Harga Mobil Listrik (setara ~Rp 350jt)
  { id: 5, name: 'Mobil Listrik Sedan', price: 0.07, currency: 'pi', description: 'Mobil sedan listrik ramah lingkungan dengan jangkauan jauh.', image: 'https://placehold.co/400x400/10b981/ffffff?text=Mobil' },
  { id: 6, name: 'Helm Motor Full Face', price: 450000, currency: 'idr', description: 'Helm standar SNI untuk keamanan berkendara maksimal.', image: 'https://placehold.co/400x400/ef4444/ffffff?text=Helm' },
    // Harga Action Figure (setara ~Rp 250rb)
  { id: 7, name: 'Action Figure Robot', price: 0.00005, currency: 'pi', description: 'Koleksi action figure robot dengan detail dan artikulasi terbaik.', image: 'https://placehold.co/400x400/38bdf8/ffffff?text=Action+Figure' },
  { id: 8, name: 'Kaos Katun Premium', price: 120000, currency: 'idr', description: 'Kaos bahan katun combed 30s, adem dan nyaman dipakai.', image: 'https://placehold.co/400x400/f59e0b/ffffff?text=Kaos' },
  // Produk Jasa Baru
  { id: 9, name: 'Jasa Desain Logo', price: 0.0001, currency: 'pi', description: 'Desain logo profesional untuk bisnis Anda, termasuk 3 revisi.', image: 'https://placehold.co/400x400/a855f7/ffffff?text=Jasa' },
];

// Variabel 'categories' yang dibutuhkan oleh halaman admin.
export const categories = [
  'Kebutuhan Pokok',
  'Elektronik',
  'Aksesoris',
  'Toys',
  'Fashion',
  'Jasa' // <-- Kategori baru ditambahkan di sini
];

export const totalAdRevenue = 5000; // Pi
export const totalAdmins = 150;

