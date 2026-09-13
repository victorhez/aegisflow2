import {NextResponse} from 'next/server';
import {incidents, getIncidentById} from '@/lib/store';
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    const inc = getIncidentById(id);
    return NextResponse.json(inc ?? {error: 'not found'}, inc ? {status: 200} : {status: 404});
  }
  return NextResponse.json({
    count: incidents.length,
    bySeverity: {
      P0: incidents.filter((i) => i.severity === 'P0').length,
      P1: incidents.filter((i) => i.severity === 'P1').length,
      P2: incidents.filter((i) => i.severity === 'P2').length,
    },
    byStatus: {
      Active: incidents.filter((i) => i.status === 'Active').length,
      Investigating: incidents.filter((i) => i.status === 'Investigating').length,
      Mitigated: incidents.filter((i) => i.status === 'Mitigated').length,
      Resolved: incidents.filter((i) => i.status === 'Resolved').length,
      Closed: incidents.filter((i) => i.status === 'Closed').length,
    },
    incidents,
  });
}
