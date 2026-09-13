import {NextResponse} from 'next/server';
import {agentRuns} from '@/lib/store';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({
    count: agentRuns.length,
    avgDurationMs: Math.round(agentRuns.reduce((s, r) => s + r.durationMs, 0) / agentRuns.length),
    successRate: Math.round((agentRuns.filter((r) => r.status === 'completed').length / agentRuns.length) * 100),
    runs: agentRuns,
  });
}
