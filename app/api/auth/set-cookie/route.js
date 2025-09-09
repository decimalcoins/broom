import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { user } = body;
    if (!user) return NextResponse.json({ error: "missing user" }, { status: 400 });

    // create a simple signed payload (in prod use secure JWT)
    const payload = Buffer.from(JSON.stringify(user)).toString('base64');

    const res = NextResponse.json({ ok: true, user });
    // set cookie for 7 days
    res.cookies.set('pi_auth', payload, { httpOnly: false, maxAge: 60*60*24*7, path: '/' });
    return res;
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
