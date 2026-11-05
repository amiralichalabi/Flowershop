/* ============ لایه‌ی جلوه‌ها و انیمیشن (v5) ============ */
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
const A=()=>window.__app;
const U=window.UFX={};
const accent=()=>(getComputedStyle(document.documentElement).getPropertyValue('--accent')||'#e83e78').trim();
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const mix=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const rnd=(a,b)=>a+Math.random()*(b-a);

/* ---------- اینترو ---------- */
(function(){
 const sp=$('#splash');if(!sp)return;
 let skip=REDUCE||/nosplash/.test(location.search+location.hash);
 try{if(sessionStorage.getItem('uf_splash'))skip=true;sessionStorage.setItem('uf_splash','1')}catch(e){}
 if(skip){sp.remove();document.body.classList.add('ready');return}
 document.body.classList.add('splashing');
 setTimeout(()=>sp.classList.add('out'),1900);
 setTimeout(()=>{sp.remove();document.body.classList.remove('splashing');document.body.classList.add('ready')},2900);
 sp.addEventListener('click',()=>{sp.classList.add('out');setTimeout(()=>{sp.remove();document.body.classList.remove('splashing');document.body.classList.add('ready')},900)});
})();

/* ---------- گلبرگ‌های دوبعدی (باران آرام + جشن) ---------- */
const cv=document.createElement('canvas');cv.id='fxc';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
const cx=cv.getContext('2d');let W=0,H=0,dpr=1;
function size(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
size();addEventListener('resize',size);
const P=[];let raf=0,lt=0,heroOn=true;
function petal(o){P.push(Object.assign({x:0,y:0,vx:0,vy:0,g:0,r:rnd(0,6.28),vr:rnd(-2,2),fl:rnd(0,6.28),vf:rnd(2,5),s:rnd(7,13),col:'#fff',life:6,age:0,sw:rnd(0,6.28),amb:false,al:.9},o))}
function go(){if(!raf&&!REDUCE){lt=performance.now();raf=requestAnimationFrame(tick)}}
function tick(t){
 raf=0;const dt=Math.min(.05,(t-lt)/1000);lt=t;
 cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,W,H);
 if(heroOn&&!document.hidden){const n=P.reduce((a,p)=>a+(p.amb?1:0),0);if(n<(W<700?8:16)&&Math.random()<dt*2.4){const c=['#ffffff','#fff0f4',mix(accent(),'#ffffff',.55),mix(accent(),'#ffffff',.8)][Math.floor(Math.random()*4)];petal({x:rnd(-20,W),y:-20,vx:rnd(-14,20),vy:rnd(34,70),col:c,s:rnd(6,12),life:18,amb:true,al:.55,vr:rnd(-1,1)})}}
 for(let i=P.length-1;i>=0;i--){
  const p=P[i];p.age+=dt;p.sw+=dt;p.vy+=p.g*dt;
  p.x+=(p.vx+Math.sin(p.sw*1.5)*(p.amb?22:10))*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;p.fl+=p.vf*dt;p.vx*=p.g?(1-dt*.6):1;
  if(p.y>H+30||p.age>p.life||p.x<-60||p.x>W+60){P.splice(i,1);continue}
  const fade=Math.min(1,p.age*2)*Math.min(1,(p.life-p.age)*1.5);
  cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.scale(1,Math.abs(Math.cos(p.fl))*.75+.25);cx.globalAlpha=Math.max(0,p.al*fade);
  const s=p.s;cx.beginPath();cx.moveTo(0,-s);cx.bezierCurveTo(s*.85,-s*.65,s*.8,s*.6,0,s);cx.bezierCurveTo(-s*.8,s*.6,-s*.85,-s*.65,0,-s);cx.fillStyle=p.col;cx.fill();cx.restore();
 }
 if(P.length||heroOn)raf=requestAnimationFrame(tick);
}
const palette=()=>{const a=accent();return [a,mix(a,'#ffffff',.35),mix(a,'#ffffff',.7),'#ffffff','#f4c26b',mix(a,'#000000',.15)]};
U.shower=function(x,y,n){ // انفجار گلبرگ از یک نقطه
 if(REDUCE)return;const pl=palette();n=n||38;
 for(let i=0;i<n;i++){const a=rnd(-Math.PI*.95,-Math.PI*.05),sp=rnd(240,760);petal({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,g:900,col:pl[i%pl.length],s:rnd(6,13),life:rnd(2.2,3.6),al:.95,vr:rnd(-5,5)})}
 go();
};
U.rain=function(n){ // بارش گلبرگ از بالا
 if(REDUCE)return;const pl=palette();n=n||60;
 for(let i=0;i<n;i++)setTimeout(()=>{petal({x:rnd(0,W),y:-20,vx:rnd(-40,40),vy:rnd(120,260),g:60,col:pl[i%pl.length],s:rnd(7,14),life:rnd(4,6),al:.95,vr:rnd(-4,4)});go()},i*28);
};
new IntersectionObserver(es=>{heroOn=es[0].isIntersecting;if(heroOn)go()},{threshold:0}).observe($('.hero'));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)go()});
go();

/* ---------- نوار پیشرفت اسکرول و جلوه‌های هیرو ---------- */
const prog=$('#prog'),hero=$('.hero');
let sy=0,tick2=0;
function onScr(){if(tick2)return;tick2=requestAnimationFrame(()=>{tick2=0;const h=document.documentElement.scrollHeight-innerHeight;if(prog)prog.style.transform=`scaleX(${h>0?scrollY/h:0})`;
 if(!REDUCE&&hero){const k=Math.min(1,scrollY/700);const t=$('.htxt');if(t){t.style.transform=`translateY(${scrollY*.14}px)`;t.style.opacity=String(1-k*.8)}}})}
addEventListener('scroll',onScr,{passive:true});onScr();
if(hero&&FINE){hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',(e.clientX-r.left)+'px');hero.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true})}

/* ---------- شمارنده‌ها ---------- */
function countUp(){
 const els=$$('[data-n]');if(!els.length)return;
 const io=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;io.unobserve(x.target);const el=x.target,to=+el.dataset.n,t0=performance.now(),d=1400;
  if(REDUCE){el.textContent=to.toLocaleString('fa-IR');return}
  const f=t=>{const k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,4);el.textContent=Math.round(to*e).toLocaleString('fa-IR');if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}),{threshold:.4});
 els.forEach(e=>{e.textContent=(0).toLocaleString('fa-IR');io.observe(e)});
}

/* ---------- کارت‌های سه‌بعدی (tilt) و دکمه‌ی مغناطیسی ---------- */
if(FINE&&!REDUCE){
 let cur=null;
 document.addEventListener('pointermove',e=>{
  const pc=e.target.closest&&e.target.closest('.pc');
  if(cur&&cur!==pc){const t=cur.querySelector('.tile');if(t){t.style.transform='';t.style.setProperty('--gx','50%');t.style.setProperty('--gy','0%')}}
  cur=pc;if(!pc)return;const t=pc.querySelector('.tile');if(!t)return;const r=t.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
  t.style.transform=`perspective(800px) rotateY(${(px-.5)*-9}deg) rotateX(${(py-.5)*7}deg) translateZ(0)`;t.style.setProperty('--gx',px*100+'%');t.style.setProperty('--gy',py*100+'%');
 },{passive:true});
 document.addEventListener('pointerleave',()=>{if(cur){const t=cur.querySelector('.tile');if(t)t.style.transform=''}},true);
 $$('.hero .cta .btn').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.28}px)`});b.addEventListener('pointerleave',()=>{b.style.transform=''})});
}

/* ---------- نور صحنه (صبح، استودیو، غروب، شب) ---------- */
function lights(){
 const st=$('#stage');if(!st||st.querySelector('.lights'))return;
 const L=[['morning','صبح'],['studio','استودیو'],['golden','غروب'],['night','شب']];
 const d=document.createElement('div');d.className='lights';d.setAttribute('role','group');d.setAttribute('aria-label','نور صحنه');
 d.innerHTML=L.map(l=>`<button type="button" data-l="${l[0]}" class="${l[0]==='studio'?'on':''}">${l[1]}</button>`).join('');
 st.appendChild(d);st.dataset.light='studio';
 d.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const n=b.dataset.l;$$('.lights button').forEach(x=>x.classList.toggle('on',x===b));st.dataset.light=n;A().STUDIO.setLight(n);try{A().HERO.setLight(n)}catch(x){}});
}

/* ---------- تم تاریک/روشن ---------- */
function themeBtn(){
 const bar=$('.bar'),cb=$('#openCart');if(!bar||!cb||$('#themeBtn'))return;
 const b=document.createElement('button');b.id='themeBtn';b.type='button';b.className='cartbtn';b.setAttribute('aria-label','تغییر حالت روشن و تاریک');
 b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle class="sun" cx="12" cy="12" r="4.2"/><g class="rays"><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5"/></g></svg>';
 bar.insertBefore(b,cb);
 const saved=store.get('uf_theme',null);if(saved)document.documentElement.dataset.theme=saved;
 const isDark=()=>{const t=document.documentElement.dataset.theme;return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches};
 const sync=()=>{b.classList.toggle('dk',isDark())};sync();
 b.onclick=()=>{const n=isDark()?'light':'dark';document.documentElement.dataset.theme=n;store.set('uf_theme',n);sync()};
}

/* ---------- کلیدهای میانبر ---------- */
document.addEventListener('keydown',e=>{
 const t=e.target;if(/INPUT|TEXTAREA|SELECT/.test(t.tagName)||e.metaKey||e.altKey)return;
 const st=$('#studio');if(!st)return;const r=st.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
 const a=A();
 if(e.key==='ArrowLeft'){a.goStep(Math.min(a.STEPS.length-1,a.step+1));e.preventDefault()}
 else if(e.key==='ArrowRight'){a.goStep(Math.max(0,a.step-1));e.preventDefault()}
 else if((e.ctrlKey)&&e.key.toLowerCase()==='z'){$('#bUndo').click();e.preventDefault()}
});

/* ---------- رویدادهای برنامه ---------- */
U.onChange=function(added){
 const a=A(),S=a.S;
 const p=$('#sPrice');if(p){p.classList.remove('bump');void p.offsetWidth;p.classList.add('bump')}
 if(added){const m=a.FL[S.mainT],col=m.cols[(S.items[S.mainT]||[0,0])[1]||0][1];setTimeout(()=>{try{a.STUDIO.burst(col,24)}catch(e){}},120)}
};
U.onBranch=function(){const ac=accent();try{A().STUDIO.setAccent(ac);A().HERO.setAccent(ac)}catch(e){}};
U.onFinal=function(){
 try{A().STUDIO.finale()}catch(e){}
 setTimeout(()=>{const r=$('#stage').getBoundingClientRect();U.shower(r.left+r.width/2,r.top+r.height*.55,46)},500);
};
U.onAdd=function(img){
 const st=$('#stage'),cb=$('#openCart');if(!st||!cb)return;
 const s=st.getBoundingClientRect(),c=cb.getBoundingClientRect();
 U.rain(34);
 const bump=()=>{cb.animate([{transform:'scale(1)'},{transform:'scale(1.35)'},{transform:'scale(1)'}],{duration:500,easing:'cubic-bezier(.3,1.6,.5,1)'});U.shower(c.left+c.width/2,c.top+c.height/2+20,22)};
 if(!img||REDUCE){bump();return}
 const im=new Image();im.src=img;const w=Math.min(220,s.width*.55);
 im.style.cssText=`position:fixed;left:${s.left+s.width/2-w/2}px;top:${s.top+s.height/2-w/2}px;width:${w}px;height:${w}px;object-fit:contain;z-index:70;pointer-events:none;border-radius:8px;box-shadow:0 18px 50px #0004;background:#fff`;
 document.body.appendChild(im);
 const dx=c.left+c.width/2-(s.left+s.width/2),dy=c.top+c.height/2-(s.top+s.height/2);
 const an=im.animate([{transform:'translate(0,0) scale(1) rotate(0)',opacity:1,offset:0},{transform:`translate(${dx*.25}px,${dy*.2-60}px) scale(.8) rotate(-6deg)`,opacity:1,offset:.35},{transform:`translate(${dx}px,${dy}px) scale(.12) rotate(14deg)`,opacity:.3,offset:1}],{duration:1000,easing:'cubic-bezier(.55,.05,.35,1)'});
 an.onfinish=()=>{im.remove();bump()};
};

/* ---------- پوستر طرح ---------- */
U.poster=function(){
 const a=A(),S=a.S,B=a.branchObj,acc=accent();
 const bgc=mix(acc,'#ffffff',.84);
 let url;try{url=a.STUDIO.snapshot(1000,bgc)}catch(e){return}
 const im=new Image();im.onload=()=>{
  const Wp=1080,Hp=1560,c=document.createElement('canvas');c.width=Wp;c.height=Hp;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,Hp);g.addColorStop(0,mix(acc,'#ffffff',.9));g.addColorStop(1,mix(acc,'#ffffff',.62));x.fillStyle=g;x.fillRect(0,0,Wp,Hp);
  x.direction='rtl';x.textAlign='center';x.fillStyle='#1d1626';
  const F='Vazirmatn, Tahoma, "Segoe UI", sans-serif',D='Vazirmatn, Tahoma, sans-serif';
  x.font=`700 74px ${D}`;x.fillText('یونی‌فلاور',Wp/2,128);
  x.font=`400 30px ${F}`;x.fillStyle=mix(acc,'#000000',.25);x.fillText(`${B.name} • ${B.uni}`,Wp/2,184);
  x.fillStyle=bgc;x.fillRect(70,226,940,940);x.drawImage(im,70,226,940,940);
  x.strokeStyle=acc;x.lineWidth=3;x.strokeRect(70,226,940,940);
  x.fillStyle='#1d1626';x.font=`700 44px ${D}`;x.fillText(S.kind==='box'?'باکس گل من':'دسته‌گل من',Wp/2,1246);
  const md=a.MODELS[S.kind].find(m=>m[0]===S.model);
  const flw=a.ORDER.filter(k=>S.items[k]&&S.items[k][0]).map(k=>`${a.fa(S.items[k][0])} ${a.FL[k].n} ${a.FL[k].cols[S.items[k][1]][0]}`);
  x.font=`400 28px ${F}`;x.fillStyle='#4a3f52';
  const wrap=(t,y,mw)=>{const w=t.split(' ');let l='',yy=y;w.forEach(wd=>{const tt=l?l+' '+wd:wd;if(x.measureText(tt).width>mw&&l){x.fillText(l,Wp/2,yy);yy+=42;l=wd}else l=tt});x.fillText(l,Wp/2,yy);return yy};
  let y=wrap(`${md[1]} ${a.SIZES[S.kind][S.size].n}`,1300,900);
  y=wrap(flw.join('، '),y+44,900);
  x.font=`700 54px ${D}`;x.fillStyle=acc;x.fillText(a.T$(a.breakdown(S).tot),Wp/2,Math.min(Hp-70,y+96));
  const out=c.toDataURL('image/png');
  const ov=document.createElement('div');ov.className='pmodal';ov.innerHTML=`<div class="pbox"><img alt="پوستر طرح" src="${out}"><div class="pact"><button type="button" class="btn ghost" data-x>بستن</button></div><small>روی تصویر نگه دار (یا راست‌کلیک کن) و ذخیره‌ش کن.</small></div>`;
  document.body.appendChild(ov);requestAnimationFrame(()=>ov.classList.add('on'));
  const close=()=>{ov.classList.remove('on');setTimeout(()=>ov.remove(),400)};
  ov.addEventListener('click',e=>{if(e.target===ov||e.target.closest('[data-x]'))close()});
 };im.src=url;
};

function gallery(){
 const g=$('#gal');if(!g||!window.PHOTOS)return;const names=['عاشقانه، رز قرمز','رز صورتی','رز و کاغذ زرشکی','رز قرمز و مشکی','آفتابگردان و کرافت','رز صورتی ملایم','رز قرمز، کاغذ مشکی'];
 g.innerHTML=[0,1,2,3,4,5,6].map(i=>`<button type="button" data-g="${i}" aria-label="${names[i]}"><img alt="${names[i]}" loading="lazy" src="${window.PHOTOS['rb'+i]}"><span>${names[i]}</span></button>`).join('');
 g.addEventListener('click',e=>{if(e.target.closest('[data-g]'))$('#studio').scrollIntoView({behavior:REDUCE?'auto':'smooth'})});
}
U.init=function(){gallery();
 lights();themeBtn();countUp();U.onBranch();
 const h=$('.hintT');if(h&&!h.dataset.k&&matchMedia('(hover:hover)').matches){h.dataset.k=1;h.textContent+=' • کلید ← و → : مرحله‌ی بعد و قبل'}
};
})();
