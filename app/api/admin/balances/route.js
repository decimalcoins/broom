import { NextResponse } from 'next/server';
import { readJson } from '@/lib/serverUtils';

export async function GET() {
  const balances = readJson('balances.json') || {};
  const logs = readJson('revenue_logs.json') || [];
  return NextResponse.json({ balances, logs });
}
