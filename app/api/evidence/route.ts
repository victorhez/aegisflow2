import {NextResponse} from 'next/server';
import {evidenceLedger} from '@/lib/store';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({
    count: evidenceLedger.length,
    byConfidence: {
      high: evidenceLedger.filter((e) => e.confidence >= 90).length,
      medium: evidenceLedger.filter((e) => e.confidence >= 75 && e.confidence < 90).length,
      low: evidenceLedger.filter((e) => e.confidence < 75).length,
    },
    evidence: evidenceLedger,
  });
}
