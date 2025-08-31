
// Global Conversion Values (GCV)
export const GCV_USD = 314159;
export const USD_TO_IDR = 16000;
export const GCV_IN_IDR = GCV_USD * USD_TO_IDR;

// Dummy products (mix IDR and Pi)
export const dummyProducts = [
  { id: 1, name: 'Beras Premium 5kg', price: 65000, currency: 'idr', image: 'https://placehold.co/400x400/22c55e/ffffff?text=Beras' },
  { id: 2, name: 'Smartphone Canggih', price: 0.0150, currency: 'pi', image: 'https://placehold.co/400x400/3b82f6/ffffff?text=Smartphone' },
  { id: 3, name: 'Minyak Goreng 2L', price: 32000, currency: 'idr', image: 'https://placehold.co/400x400/f97316/ffffff?text=Minyak' },
  { id: 4, name: 'Headphone Wireless', price: 0.00025, currency: 'pi', image: 'https://placehold.co/400x400/8b5cf6/ffffff?text=Headphone' },
  { id: 5, name: 'Mobil Listrik Sedan', price: 0.1, currency: 'pi', image: 'https://placehold.co/400x400/10b981/ffffff?text=Mobil' },
  { id: 6, name: 'Helm Motor Full Face', price: 450000, currency: 'idr', image: 'https://placehold.co/400x400/ef4444/ffffff?text=Helm' },
  { id: 7, name: 'Action Figure Robot', price: 0.0015, currency: 'pi', image: 'https://placehold.co/400x400/38bdf8/ffffff?text=Action+Figure' },
  { id: 8, name: 'Kaos Katun Premium', price: 120000, currency: 'idr', image: 'https://placehold.co/400x400/f59e0b/ffffff?text=Kaos' },
];

// === PENAMBAHAN UNTUK MEMPERBAIKI ERROR BUILD ===
// Variabel 'categories' yang dibutuhkan oleh halaman admin.
export const categories = [
  'Kebutuhan Pokok',
  'Elektronik',
  'Aksesoris',
  'Toys',
  'Fashion'
];
// ===============================================

export const totalAdRevenue = 5000; // Pi
export const totalAdmins = 150;
