import {NextResponse} from 'next/server';
import {workspace, integrations, incidents, actionReceipts} from '@/lib/store';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({
    workspace,
    integrations,
    systemHealth: {
      connectedApps: integrations.filter((i) => i.connected).length,
      totalApps: integrations.length,
      activeIncidents: incidents.filter((i) => ['Active', 'Investigating'].includes(i.status)).length,
      mitigatedIncidents: incidents.filter((i) => ['Mitigated', 'Resolved', 'Closed'].includes(i.status)).length,
      lastActionAt: actionReceipts[0]?.timestamp ?? null,
    },
  });
}
