const te = new TextEncoder();
function b64url(bytes){
  let bin=''; for(const b of new Uint8Array(bytes)) bin+=String.fromCharCode(b);
  return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
async function sign(secret, data){
  const key = await crypto.subtle.importKey('raw',te.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  return b64url(await crypto.subtle.sign('HMAC',key,te.encode(data)));
}
async function safeEqual(a,b){
  if(a.length!==b.length) return false;
  let out=0; for(let i=0;i<a.length;i++) out |= a.charCodeAt(i)^b.charCodeAt(i);
  return out===0;
}
export async function onRequestPost(context){
  const secret=context.env.SITE_PASSWORD;
  if(!secret) return new Response(JSON.stringify({error:'SITE_PASSWORD is not configured'}),{status:500,headers:{'content-type':'application/json'}});
  let payload={};
  try{payload=await context.request.json()}catch(e){}
  const supplied=String(payload.password||'');
  if(!supplied || !(await safeEqual(supplied,secret))){
    return new Response(JSON.stringify({ok:false}),{status:401,headers:{'content-type':'application/json','cache-control':'no-store'}});
  }
  const exp=Math.floor(Date.now()/1000)+(60*60*24*7);
  const sig=await sign(secret,String(exp));
  const cookie=`drip91_session=${exp}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`;
  return new Response(JSON.stringify({ok:true}),{status:200,headers:{'content-type':'application/json','set-cookie':cookie,'cache-control':'no-store'}});
}
export async function onRequest(){
  return new Response('Method Not Allowed',{status:405,headers:{Allow:'POST'}});
}
