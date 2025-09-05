import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { totalAdRevenue } from '@/lib/constants'; // Mengambil total pendapatan dari file konstanta

export async function GET() {
  try {
    // 1. Menghitung jumlah total admin yang terdaftar di database
    const adminCount = await prisma.admin.count();

    // === PERUBAHAN: Menerapkan aturan pembagian SHU yang baru ===

    // 2. Menghitung total dana SHU yang akan dibagikan (15% dari total pendapatan)
    const distributableShuPool = totalAdRevenue * 0.15;

    // 3. Menghindari pembagian dengan nol jika tidak ada admin
    let shuPerAdmin = 0;
    if (adminCount > 0) {
      // 4. Menghitung SHU per admin dengan membagi dana SHU
      shuPerAdmin = distributableShuPool / adminCount;
    }

    // 5. Mengirimkan hasil perhitungan yang lebih detail ke frontend
    return NextResponse.json({
      totalAdRevenue,
      distributableShuPool,
      adminCount,
      shuPerAdmin,
    });

  } catch (error) {
    console.error("Error saat menghitung SHU:", error);
    return NextResponse.json({ error: "Gagal mengambil data SHU." }, { status: 500 });
  }
}

