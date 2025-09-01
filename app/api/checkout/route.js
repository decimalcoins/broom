import { NextResponse } from 'next/server';

// Fungsi untuk memvalidasi pembayaran dengan server Pi (tetap sama)
async function verifyPiPayment(paymentId) {
  const PI_API_KEY = process.env.PI_API_KEY;
  if (!PI_API_KEY) {
    throw new Error('Kunci API Pi tidak ditemukan di environment variables.');
  }

  const url = `https://api.minepi.com/v2/payments/${paymentId}/complete`;
  
  console.log(`Menyetujui pembayaran Pi dengan ID: ${paymentId}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
      },
      body: JSON.stringify({ txid: '' }), // Mengosongkan txid untuk auto-complete
    });
    
    const data = await response.json();

    if (!response.ok) {
      console.error('Gagal menyelesaikan pembayaran Pi:', data);
      throw new Error(data.message || 'Gagal berkomunikasi dengan server Pi.');
    }

    console.log('Respons dari server Pi:', data);
    return data;
  } catch (error) {
    console.error('Error saat verifikasi pembayaran Pi:', error);
    throw error;
  }
}


export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Menerima data checkout baru:", body);

    // === DIPERBARUI: Menangani dua jenis checkout ===

    // 1. Jika ini adalah pembayaran Pi (memiliki paymentId)
    if (body.paymentId) {
      console.log('Memproses pembayaran Pi...');
      await verifyPiPayment(body.paymentId);
      
      // Kirim respons sukses kembali ke frontend
      return NextResponse.json({ 
        message: 'Pembayaran Pi berhasil diverifikasi dan selesai!' 
      }, { status: 200 });
    } 
    
    // 2. Jika ini adalah konfirmasi transfer bank (memiliki tipe 'bank_transfer')
    else if (body.type === 'bank_transfer') {
      console.log('Memproses konfirmasi transfer bank...');
      // Di aplikasi nyata, di sinilah Anda akan:
      // - Menyimpan detail pesanan (product, address, dll.) ke database Anda.
      // - Mengunggah bukti pembayaran (body.fileName) ke layanan cloud storage.
      // - Menandai pesanan sebagai "Menunggu Verifikasi Admin".
      
      // Untuk simulasi ini, kita anggap berhasil dan kirim respons sukses.
      return NextResponse.json({ 
        message: 'Konfirmasi pembayaran Anda telah diterima dan akan segera kami proses.' 
      }, { status: 200 });
    }

    // Jika data yang diterima tidak sesuai format
    else {
      return NextResponse.json({ message: 'Data checkout tidak valid.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error di API checkout:', error);
    return NextResponse.json({ message: error.message || 'Terjadi kesalahan internal server.' }, { status: 500 });
  }
}

