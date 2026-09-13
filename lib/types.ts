export type AppKey='stripe'|'slack'|'github'|'linear'|'gmail';
export type Integration={id:AppKey;name:string;description:string;connected:boolean;configured:boolean;secretHint:string};
export type Evidence={id:string;app:string;finding:string;confidence:number;timestamp:string};
export type ActionReceipt={id:string;app:string;action:string;status:'success'|'pending'|'failed';timestamp:string;detail:string;idempotencyKey:string};
export type AgentEvent={id:string;title:string;detail:string;timestamp:string};
export type Incident={id:string;title:string;severity:'P0'|'P1'|'P2';status:string;confidence:number;createdAt:string;apps:string[];evidence:Evidence[];actions:ActionReceipt[];events:AgentEvent[]};
