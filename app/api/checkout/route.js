
import { NextResponse } from 'next/server';

/**
 * Handler untuk permintaan POST ke /api/checkout.
 * Endpoint ini akan menerima data checkout dari frontend,
 * seperti detail produk, alamat, dan metode pengiriman.
 */
export async function POST(request) {
  try {
    // Mengambil data JSON yang dikirim dari body permintaan
    const checkoutData = await request.json();

    // Di aplikasi nyata, di sinilah Anda akan memproses pesanan:
    // 1. Menyimpan data pesanan ke database.
    // 2. Memproses pembayaran dengan payment gateway (Midtrans, Xendit, dll).
    // 3. Mengurangi stok produk.
    // 4. Mengirim email konfirmasi ke pengguna.

    // Untuk saat ini, kita hanya akan menampilkan data di log server
    console.log("Menerima data checkout baru:", checkoutData);

    // Mengirimkan respons sukses kembali ke frontend
    return NextResponse.json(
      { message: "Checkout berhasil diterima dan sedang diproses!" },
      { status: 200 }
    );
  } catch (error) {
    // Penanganan error jika terjadi masalah
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memproses checkout" },
      { status: 500 }
    );
  }
}
