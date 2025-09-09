
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// --- FUNGSI GET: Mengambil profil toko berdasarkan username ---
export async function GET(req) {
  console.log("--- GET /api/store/profile ---");
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    console.log("Mencari profil untuk username:", username);

    if (!username) {
      console.log("Username tidak ditemukan di query params.");
      return NextResponse.json({ error: 'Username diperlukan' }, { status: 400 });
    }
    
    const admin = await prisma.admin.findUnique({
      where: { username },
      include: { storeProfile: true },
    });
    
    if (!admin) {
        console.log(`Admin dengan username '${username}' tidak ditemukan di database.`);
        return NextResponse.json({ error: 'Admin tidak ditemukan' }, { status: 404 });
    }

    if (!admin.storeProfile) {
      console.log(`Profil toko untuk admin '${username}' tidak ditemukan.`);
      return NextResponse.json({ error: 'Profil tidak ditemukan' }, { status: 404 });
    }

    console.log("Profil ditemukan:", admin.storeProfile);
    return NextResponse.json(admin.storeProfile);
  } catch (error) {
    console.error("Error di GET /api/store/profile:", error);
    return NextResponse.json({ error: 'Gagal mengambil profil', details: error.message }, { status: 500 });
  }
}


// --- FUNGSI POST: Menyimpan/memperbarui profil toko berdasarkan username ---
export async function POST(req) {
    console.log("--- POST /api/store/profile ---");
  try {
    const data = await req.formData();
    const username = data.get('username');
    const storeName = data.get('storeName');
    const description = data.get('description');
    console.log("Menerima data POST untuk username:", username);
    console.log("Data form:", { storeName, description });
    
    if (!username) {
        console.log("Username tidak ada di form data POST.");
        return NextResponse.json({ error: 'Username diperlukan untuk menyimpan profil' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });

    if(!admin) {
        console.log(`Admin dengan username '${username}' tidak ditemukan saat mencoba POST.`);
        return NextResponse.json({ error: 'Admin tidak ditemukan' }, { status: 404 });
    }
    
    console.log(`Menjalankan upsert untuk adminId: ${admin.id}`);
    const profile = await prisma.storeProfile.upsert({
      where: { adminId: admin.id },
      update: { storeName, description },
      create: { adminId: admin.id, storeName, description },
    });

    console.log("Profil berhasil disimpan/diperbarui:", profile);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error di POST /api/store/profile:", error);
    return NextResponse.json({ error: 'Gagal menyimpan profil', details: error.message }, { status: 500 });
  }
}

