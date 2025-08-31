
import { NextResponse } from 'next/server';
import { dummyProducts } from '@/lib/constants';

/**
 * Handler untuk permintaan GET ke /api/products.
 * Endpoint ini akan mengembalikan daftar semua produk.
 * Di aplikasi nyata, data ini akan diambil dari database.
 */
export async function GET() {
  try {
    // Simulasi pengambilan data dari database
    const products = dummyProducts;

    // Mengirimkan data produk sebagai respons JSON
    return NextResponse.json(products);
  } catch (error) {
    // Penanganan error jika terjadi masalah
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}