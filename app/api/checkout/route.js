import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// === FUNGSI BARU: Untuk memverifikasi dan menyelesaikan pembayaran dengan server Pi ===
async function verifyAndCompletePiPayment(paymentId) {
  // Ambil Kunci API rahasia Anda dari environment variables
  const PI_API_KEY = process.env.PI_API_KEY;
  if (!PI_API_KEY) {
    // Error jika Kunci API tidak diatur di Vercel atau .env.local
    throw new Error('Kunci API Pi tidak ditemukan. Harap atur PI_API_KEY.');
  }

  const url = `https://api.minepi.com/v2/payments/${paymentId}/complete`;
  
  console.log(`Menyetujui pembayaran Pi dengan ID: ${paymentId} ke server Pi...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`, // Gunakan format otorisasi yang benar
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Kirim body kosong untuk menyelesaikan pembayaran
    });
    
    const data = await response.json();

    // Jika server Pi mengembalikan error, lemparkan error tersebut
    if (!response.ok) {
      console.error('Gagal menyelesaikan pembayaran Pi:', data);
      throw new Error(data.message || 'Gagal berkomunikasi dengan server Pi.');
    }

    console.log('Respons sukses dari server Pi:', data);
    return data; // Kembalikan data transaksi yang berhasil
  } catch (error) {
    console.error('Error saat verifikasi pembayaran Pi:', error);
    // Lemparkan kembali error untuk ditangani oleh handler utama
    throw error;
  }
}


export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Menerima data checkout baru:", body);

    // --- Logika Cerdas untuk Menangani Jenis Checkout Berbeda ---

    // 1. Jika ini adalah pembayaran Pi (memiliki 'paymentId')
    if (body.paymentId) {
      console.log('Memproses pembayaran Pi...');
      
      // Panggil fungsi verifikasi yang baru kita buat
      await verifyAndCompletePiPayment(body.paymentId);
      
      // Di aplikasi nyata, Anda bisa menyimpan transaksi ini ke database di sini
      // await prisma.transaction.create({ data: { ... } });

      // Kirim respons sukses kembali ke frontend
      return NextResponse.json({ 
        message: 'Pembayaran Pi berhasil diverifikasi dan selesai!' 
      }, { status: 200 });
    } 
    
    // 2. Jika ini adalah konfirmasi transfer bank
    else if (body.type === 'bank_transfer') {
      console.log('Memproses konfirmasi transfer bank...');
      
      // Simpan pesanan ke database dengan status "Menunggu Verifikasi"
      // await prisma.order.create({ data: { ... } });
      
      return NextResponse.json({ 
        message: 'Konfirmasi pembayaran Anda telah diterima dan akan segera kami proses.' 
      }, { status: 200 });
    }

    // Jika data yang diterima tidak valid
    else {
      return NextResponse.json({ message: 'Data checkout tidak valid.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error di API checkout:', error);
    return NextResponse.json({ message: error.message || 'Terjadi kesalahan internal server.' }, { status: 500 });
  }
}

