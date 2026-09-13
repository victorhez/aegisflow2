import {NextResponse} from 'next/server'; import {evaluations} from '@/lib/store'; export const dynamic='force-dynamic'; export async function GET(){
  const pass = evaluations.filter(e=>e.pass).length;
  return NextResponse.json({
    total: evaluations.length,
    passed: pass,
    failed: evaluations.length - pass,
    passRate: Math.round((pass/evaluations.length)*100),
    suites: evaluations,
  });
}
