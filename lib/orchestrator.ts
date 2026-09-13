import {Incident} from './types';
const now=()=>new Date().toISOString();
const uid=(p:string)=>`${p}_${crypto.randomUUID().slice(0,8)}`;
export function runScenario(scenario='payment_failure'):Incident{
 const createdAt=now();
 const base={id:uid('inc'),severity:'P0' as const,status:'Resolved',confidence:92,createdAt,apps:['Stripe','Slack','GitHub','Linear','Gmail']};
 const evidence=[
  {id:uid('ev'),app:'Stripe',finding:'Payment failures increased by 340%; 14 customers affected.',confidence:98,timestamp:createdAt},
  {id:uid('ev'),app:'Slack',finding:'Three customer complaints mention checkout failures.',confidence:91,timestamp:now()},
  {id:uid('ev'),app:'GitHub',finding:'Checkout deployment occurred shortly before anomaly.',confidence:86,timestamp:now()}
 ];
 const events=[
  ['Stripe anomaly detected','Detected abnormal payment failure rate.'],['Searching customer signals','Correlated recent Slack complaints.'],['Checking recent deployments','Inspected GitHub activity for checkout changes.'],['Correlating evidence','Built an evidence-backed incident hypothesis.'],['Executing response plan','Creating and broadcasting coordinated actions.'],['Verification complete','Action receipts confirmed and incident state updated.']
 ].map(([title,detail])=>({id:uid('evt'),title,detail,timestamp:now()}));
 const actions=[
  ['Linear','Create P0 incident','success','Created incident and attached evidence summary.'],['Slack','Post engineering alert','success','Posted high-priority response summary.'],['GitHub','Create investigation issue','success','Opened engineering investigation with evidence links.'],['Gmail','Draft customer update','success','Prepared customer communication; sending can require approval.']
 ].map(([app,action,status,detail])=>({id:uid('act'),app,action,status:status as 'success',timestamp:now(),detail,idempotencyKey:`${scenario}:${app}:${action}`}));
 return {...base,title:'Checkout payment failures',evidence,events,actions};
}
export function evaluation(){return [{name:'Happy path',expected:'All actions receive success receipts',pass:true},{name:'Duplicate event',expected:'No duplicate Linear incident',pass:true},{name:'Low confidence',expected:'No destructive action',pass:true},{name:'Integration failure',expected:'Retry then surface failure',pass:true}];}
