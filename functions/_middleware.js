const te=new TextEncoder();
function b64url(bytes){let bin='';for(const b of new Uint8Array(bytes))bin+=String.fromCharCode(b);return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function sign(secret,data){const key=await crypto.subtle.importKey('raw',te.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return b64url(await crypto.subtle.sign('HMAC',key,te.encode(data)))}
function cookieValue(req,name){const raw=req.headers.get('cookie')||'';for(const part of raw.split(';')){const [k,...v]=part.trim().split('=');if(k===name)return v.join('=')}return ''}
async function verify(req,secret){const value=cookieValue(req,'drip91_session');if(!value)return false;const [exp,sig]=value.split('.');if(!exp||!sig||Number(exp)<Math.floor(Date.now()/1000))return false;const expected=await sign(secret,exp);if(sig.length!==expected.length)return false;let diff=0;for(let i=0;i<sig.length;i++)diff|=sig.charCodeAt(i)^expected.charCodeAt(i);return diff===0}
export async function onRequest(context){
  const url=new URL(context.request.url);
  const p=url.pathname;
  const publicPaths=new Set(['/','/index.html','/favicon.svg','/robots.txt','/api/login','/api/session','/api/logout']);
  if(publicPaths.has(p)) return context.next();
  const secret=context.env.SITE_PASSWORD;
  if(!secret) return new Response('DRIP91 archive is not configured.',{status:503,headers:{'content-type':'text/plain;charset=UTF-8','cache-control':'no-store'}});
  if(await verify(context.request,secret)) return context.next();
  if(p.startsWith('/api/')) return new Response(JSON.stringify({error:'unauthorized'}),{status:401,headers:{'content-type':'application/json','cache-control':'no-store'}});
  return new Response('Unauthorized',{status:401,headers:{'content-type':'text/plain;charset=UTF-8','cache-control':'no-store'}});
}
