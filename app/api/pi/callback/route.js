import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { readJson, writeJson } from '@/lib/serverUtils';

export async function POST(req) {
  // Expect header 'x-pi-signature' if webhook secret used
  const secret = process.env.PI_WEBHOOK_SECRET || null;
  const signature = req.headers.get('x-pi-signature');

  const text = await req.text();
  if (secret && signature) {
    const h = crypto.createHmac('sha256', secret).update(text).digest('hex');
    if (h !== signature) {
      return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
    }
  }

  let payload;
  try {
    payload = JSON.parse(text);
  } catch (e) {
    payload = { raw: text };
  }

  // persist to payments log
  const payments = readJson('payments.json') || [];
  payments.unshift({ receivedAt: new Date().toISOString(), payload });
  writeJson('payments.json', payments.slice(0, 500));

  return NextResponse.json({ ok: true, received: payload });
}
