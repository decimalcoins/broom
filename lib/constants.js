// Global Conversion Values (GCV)
export const GCV_USD = 314159;
export const USD_TO_IDR = 16000;
export const GCV_IN_IDR = GCV_USD * USD_TO_IDR;

// Dummy products (mix IDR and Pi)
export const dummyProducts = [
  { id: 1, name: 'Beras Premium 5kg', price: 65000, currency: 'idr', image: 'https://placehold.co/400x400/22c55e/ffffff?text=Beras', category: 'Kebutuhan Pokok', stock: 50 },
  { id: 2, name: 'Smartphone Canggih', price: 150, currency: 'pi', image: 'https://placehold.co/400x400/3b82f6/ffffff?text=Smartphone', category: 'Elektronik', stock: 15 },
  { id: 3, name: 'Minyak Goreng 2L', price: 32000, currency: 'idr', image: 'https://placehold.co/400x400/f97316/ffffff?text=Minyak', category: 'Kebutuhan Pokok', stock: 100 },
  { id: 4, name: 'Headphone Wireless', price: 25, currency: 'pi', image: 'https://placehold.co/400x400/8b5cf6/ffffff?text=Headphone', category: 'Elektronik', stock: 0 },
  { id: 5, name: 'Mobil Listrik Sedan', price: 1200, currency: 'pi', image: 'https://placehold.co/400x400/14b8a6/ffffff?text=Mobil', category: 'Kendaraan', stock: 5 },
  { id: 6, name: 'Helm Motor Full Face', price: 450000, currency: 'idr', image: 'https://placehold.co/400x400/f43f5e/ffffff?text=Helm', category: 'Aksesoris', stock: 40 },
  { id: 7, name: 'Action Figure Robot', price: 15, currency: 'pi', image: 'https://placehold.co/400x400/38bdf8/ffffff?text=Action+Figure', category: 'Toys', stock: 30 },
  { id: 8, name: 'Kaos Katun Premium', price: 120000, currency: 'idr', image: 'https://placehold.co/400x400/fbbf24/ffffff?text=Kaos', category: 'Fashion', stock: 75 },
];

export const totalAdRevenue = 5000; // Pi
export const totalAdmins = 150;
