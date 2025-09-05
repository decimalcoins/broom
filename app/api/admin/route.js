import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fungsi untuk MEMERIKSA status admin
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ isAdmin: false });
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    return NextResponse.json({ isAdmin: !!admin });
  } catch (error) {
    console.error("Error di GET /api/admin:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Fungsi untuk MENDAFTARKAN admin baru
export async function POST(req) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: "Username diperlukan" }, { status: 400 });
    }

    const newAdmin = await prisma.admin.create({
      data: { username },
    });
    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (err) {
    console.error("Error di POST /api/admin:", err);
    if (err.code === 'P2002') {
        return NextResponse.json({ error: "Admin dengan username ini sudah ada." }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal membuat admin." }, { status: 500 });
  }
}

