(() => {
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

  // Responsive navigation and section tracking.
  const menu=$('#menuToggle'), nav=$('#nav'), navLinks=$$('.nav-links a');
  const closeMenu=()=>{nav.classList.remove('menu-open');menu.setAttribute('aria-expanded','false')};
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open))});
  navLinks.forEach(link=>link.addEventListener('click',closeMenu));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  const sections=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting)navLinks.forEach(link=>{
      const active=link.hash==='#'+entry.target.id;
      link.classList.toggle('active',active);
      if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    });
  }),{rootMargin:'-15% 0px -55% 0px'});
  ['samples','campaign','archive'].forEach(id=>sections.observe(document.getElementById(id)));

  // Reveal on scroll
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -8%'});
  $$('.reveal').forEach(el=>io.observe(el));

  // Front/back switchers: only one clean tee image at a time.
  $$('[data-switcher]').forEach(sw=>{
    const buttons=$$('.switch-tabs button',sw), imgs=$$('.switch-img',sw), data=$('.product-data span:last-child',sw);
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      buttons.forEach(b=>b.classList.toggle('active',b===btn));
      imgs.forEach(i=>i.classList.toggle('active',i.dataset.side===btn.dataset.show));
      if(data) data.textContent = btn.dataset.show==='front' ? 'VIEW / 01 OF 02' : 'VIEW / 02 OF 02';
    }));
  });

  // 3D tee viewer
  $$('[data-viewer]').forEach(stage=>{
    const obj=$('[data-object]',stage); let rot=-12,target=-12,drag=false,lastX=0,lastT=0,velocity=.018,raf;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const update=()=>{
      if(!drag && !reduced){target += .12 + velocity; velocity*=.985}
      rot += (target-rot)*.085;
      const tilt = Math.max(-7,Math.min(7,(rot-target)*.08));
      obj.style.transform=`rotateX(${tilt}deg) rotateY(${rot}deg) translateZ(0)`;
      raf=requestAnimationFrame(update);
    };
    const down=e=>{drag=true;lastX=e.clientX??e.touches?.[0]?.clientX??0;lastT=performance.now();velocity=0;stage.setPointerCapture?.(e.pointerId)};
    const move=e=>{if(!drag)return;const x=e.clientX??e.touches?.[0]?.clientX??lastX;const now=performance.now();const dx=x-lastX;target+=dx*.55;velocity=(dx/Math.max(8,now-lastT))*1.8;lastX=x;lastT=now;e.preventDefault?.()};
    const up=()=>{drag=false};
    stage.addEventListener('pointerdown',down);stage.addEventListener('pointermove',move);stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);stage.addEventListener('pointerleave',up);
    update();
  });

  // Sound control hooks into player created on the public gate page.
  const sound=$('#soundToggle');
  const syncSound=()=>{const a=window.DRIP91_AUDIO;const on=!!a?.playing;sound.textContent=on?'SOUND ON':(a?.ready?'SOUND OFF':'ENABLE SOUND');sound.classList.toggle('off',!on)};
  sound?.addEventListener('click',async()=>{try{await window.DRIP91_AUDIO?.toggle()}catch(e){} syncSound()});
  window.addEventListener('d91audiochange',syncSound);syncSound();

  // Lightbox
  const lightbox=$('#lightbox'), lbImg=$('.lightbox-inner img'), lbLabel=$('.lightbox-inner span');
  const closeLb=()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true')};
  $$('.archive-item').forEach(item=>item.addEventListener('click',()=>{lbImg.src=item.dataset.full;lbLabel.textContent=item.dataset.title;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false')}));
  $('.lightbox-close')?.addEventListener('click',closeLb);lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLb()});window.addEventListener('keydown',e=>{if(e.key==='Escape')closeLb()});

  // Custom cursor
  const cursor=$('#cursor'); if(cursor && matchMedia('(pointer:fine)').matches){
    window.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.classList.add('show')},{passive:true});
    $$('[data-viewer]').forEach(el=>{el.addEventListener('pointerenter',()=>{cursor.classList.remove('view');cursor.querySelector('span').textContent='DRAG'});el.addEventListener('pointerleave',()=>cursor.classList.remove('show'))});
    $$('.archive-item').forEach(el=>{el.addEventListener('pointerenter',()=>{cursor.classList.add('view');cursor.classList.add('show')});el.addEventListener('pointerleave',()=>cursor.classList.remove('view'))});
  }

  // Tiny parallax, intentionally restrained.
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const title=$('.hero-title'); let ticking=false;
    window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{const y=Math.min(innerHeight,scrollY);if(title)title.style.transform=`translateY(${y*.08}px)`;ticking=false});ticking=true}},{passive:true});
  }
})();
