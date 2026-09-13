import {NextResponse} from 'next/server';
export const dynamic='force-dynamic';
export async function POST(req:Request){
 const {id,secret}=await req.json().catch(()=>({}));
 if(!id||!secret) return NextResponse.json({ok:false,error:'Integration and credential are required.'},{status:400});
 try{
  let response:Response;
  if(id==='github') response=await fetch('https://api.github.com/user',{headers:{Authorization:`Bearer ${secret}`,Accept:'application/vnd.github+json'}});
  else if(id==='slack') response=await fetch('https://slack.com/api/auth.test',{headers:{Authorization:`Bearer ${secret}`}});
  else if(id==='linear') response=await fetch('https://api.linear.app/graphql',{method:'POST',headers:{Authorization:secret,'Content-Type':'application/json'},body:JSON.stringify({query:'query { viewer { id name } }'})});
  else if(id==='stripe') response=await fetch('https://api.stripe.com/v1/balance',{headers:{Authorization:`Bearer ${secret}`}});
  else return NextResponse.json({ok:true,mode:'configured',message:'Gmail requires OAuth and should be connected through a provider-specific authorization flow.'});
  const data=await response.json().catch(()=>({}));
  const ok=response.ok && (data.ok===undefined || data.ok===true);
  return NextResponse.json({ok,status:response.status,message:ok?'Connection verified.':'Provider rejected the credential.',provider:data.ok===false?data.error||'Unknown provider error':undefined});
 }catch{return NextResponse.json({ok:false,error:'Could not reach provider. Check network and credential.'},{status:502})}
}
