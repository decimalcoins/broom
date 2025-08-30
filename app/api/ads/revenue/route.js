import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/serverUtils';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, sellerId } = body;
    if (typeof amount !== 'number') return NextResponse.json({ error: 'amount must be number' }, { status: 400 });

    // revenue logic:
    // - 50% reserved for publisher pool
    // - admin takes 15% of that 50% (i.e., 0.5 * 0.15)
    // - seller gets remainder of publisher pool
    const publisherPool = amount * 0.5;
    const adminShare = publisherPool * 0.15;
    const sellerShare = publisherPool - adminShare;
    const reserve = amount - publisherPool;

    // store balances
    const balances = readJson('balances.json') || {};
    balances['admin'] = (balances['admin'] || 0) + adminShare;
    balances[sellerId || 'unknown_seller'] = (balances[sellerId || 'unknown_seller'] || 0) + sellerShare;

    writeJson('balances.json', balances);

    // store revenue log
    const logs = readJson('revenue_logs.json') || [];
    logs.unshift({
      ts: new Date().toISOString(),
      amount,
      sellerId: sellerId || null,
      adminShare,
      sellerShare,
      reserve
    });
    writeJson('revenue_logs.json', logs.slice(0, 1000));

    return NextResponse.json({ ok: true, adminShare, sellerShare, reserve });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
