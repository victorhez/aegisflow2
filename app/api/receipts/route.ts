import {NextResponse} from 'next/server';
import {actionReceipts} from '@/lib/store';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({
    count: actionReceipts.length,
    byStatus: {
      success: actionReceipts.filter((r) => r.status === 'success').length,
      pending: actionReceipts.filter((r) => r.status === 'pending').length,
      failed: actionReceipts.filter((r) => r.status === 'failed').length,
    },
    byApp: actionReceipts.reduce<Record<string, number>>((acc, r) => {
      acc[r.app] = (acc[r.app] ?? 0) + 1;
      return acc;
    }, {}),
    receipts: actionReceipts,
  });
}
