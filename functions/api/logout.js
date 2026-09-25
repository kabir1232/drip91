export async function onRequestPost(){
  return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','set-cookie':'drip91_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0','cache-control':'no-store'}});
}
