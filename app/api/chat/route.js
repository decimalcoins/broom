
import { NextResponse } from 'next/server';

/**
 * Handler untuk permintaan POST ke /api/chat.
 * Endpoint ini akan menerima pesan chat baru dari pengguna.
 */
export async function POST(request) {
  try {
    // Mengambil data JSON dari body permintaan
    const { message, productId } = await request.json();

    // Validasi input sederhana
    if (!message || !productId) {
      return NextResponse.json(
        { message: "Pesan dan ID produk tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Di aplikasi nyata, Anda akan:
    // 1. Menyimpan pesan ke database yang terhubung dengan pengguna dan produk.
    // 2. Mungkin menggunakan layanan real-time seperti WebSockets (misalnya, Pusher, Socket.io)
    //    untuk mengirim pesan langsung ke penjual tanpa perlu me-refresh halaman.

    // Untuk saat ini, kita hanya akan menampilkan pesan di log server
    console.log(`Pesan baru untuk produk ID ${productId}: "${message}"`);

    // Mengirimkan respons sukses kembali ke frontend
    return NextResponse.json(
      { message: "Pesan berhasil terkirim" },
      { status: 200 }
    );
  } catch (error) {
    // Penanganan error
    console.error("Error processing chat message:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengirim pesan" },
      { status: 500 }
    );
  }
}
