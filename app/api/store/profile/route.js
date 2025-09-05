import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// --- FUNGSI GET: Mengambil profil toko berdasarkan username ---
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username diperlukan' }, { status: 400 });
    }

    // Cari admin berdasarkan username, dan sertakan profil tokonya
    const admin = await prisma.admin.findUnique({
      where: { username },
      include: { storeProfile: true },
    });

    if (!admin || !admin.storeProfile) {
      return NextResponse.json({ error: 'Profil tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(admin.storeProfile);

  } catch (error) {
    console.error("Error mengambil profil:", error);
    return NextResponse.json({ error: 'Gagal mengambil profil' }, { status: 500 });
  }
}

// --- FUNGSI POST: Menyimpan/memperbarui profil toko berdasarkan username ---
export async function POST(req) {
  try {
    const data = await req.formData();
    const username = data.get('username');
    const storeName = data.get('storeName');
    const description = data.get('description');
    // Logika untuk upload gambar akan ditambahkan nanti
    
    if (!username) {
      return NextResponse.json({ error: 'Username diperlukan untuk menyimpan profil' }, { status: 400 });
    }

    // 1. Cari admin berdasarkan username
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin tidak ditemukan' }, { status: 404 });
    }
    
    // 2. Simpan atau perbarui profil toko yang terhubung dengan adminId
    const profile = await prisma.storeProfile.upsert({
      where: { adminId: admin.id },
      update: { storeName, description },
      create: { adminId: admin.id, storeName, description },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error menyimpan profil:", error);
    return NextResponse.json({ error: 'Gagal menyimpan profil' }, { status: 500 });
  }
}

