/* ============ موتور عکس واقعی: چیدن عکس گل‌ها، کاغذ، روبان و باکس روی بوم دوبعدی ============ */
(function(){
const PI=Math.PI,FD=window.FD,{FL,ORDER,PAPERS,RIBS,BOXCOL}=FD;
const mkC=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c};
const shadeHex=(h,p)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(p<0?v*(1+p):v+(255-v)*p)));return'#'+((1<<24)+(f(n>>16)<<16)+(f(n>>8&255)<<8)+f(n&255)).toString(16).slice(1)};
const rngf=seed=>{let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296}};
const rgb=h=>{const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]};
const rgba=(h,a)=>{const c=rgb(h);return`rgba(${c[0]},${c[1]},${c[2]},${a})`};
const GOLD=2.39996323;
window.__F3parts={shadeHex,mkC,rngf};

/* ---------- بارگذاری عکس‌ها ---------- */
const IMG={};
const PH=window.PH={IMG,ready:null};
PH.ready=Promise.all(Object.keys(window.PHOTOS||{}).map(k=>new Promise(r=>{const im=new Image();im.onload=()=>{IMG[k]=im;r()};im.onerror=r;im.src=window.PHOTOS[k]}))).then(()=>{PH.ok=true});
const tintCache={};
function tinted(name,hex){ // رنگ‌دهی یک پاپیون با حفظ سایه‌روشن
 const k=name+hex;if(tintCache[k])return tintCache[k];const im=IMG[name];if(!im)return null;
 const c=mkC(im.width,im.height),x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height),p=d.data,[R,G,B]=rgb(hex);
 for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const L=(p[i]*.3+p[i+1]*.59+p[i+2]*.11)/255;const lo=Math.min(1,L/.8),hi=Math.max(0,(L-.8)/.2);
  p[i]=Math.min(255,R*lo*.95+(255-R)*hi*.5);p[i+1]=Math.min(255,G*lo*.95+(255-G)*hi*.5);p[i+2]=Math.min(255,B*lo*.95+(255-B)*hi*.5)}
 x.putImageData(d,0,0);return tintCache[k]=c;
}
const BOWS=['bow_red','bow_gold','bow_cream','bow_black','bow_pink','bow_burg',['bow_cream','#2f6b4a'],['bow_cream','#2d5a8c']];
const bowSprite=i=>{const b=BOWS[i];return typeof b==='string'?IMG[b]:tinted(b[0],b[1])};

/* ---------- ابعاد و تنظیم هر گل ---------- */
const DIA={rose:1,lily:1.5,tulip:.86,gerbera:1.05,carn:.84};
const CROP={rose:.9,lily:1,tulip:.62,gerbera:1,carn:.5}; // بخش بالای عکس که کشیده می‌شه
const ANCH={rose:.5,lily:.5,tulip:.36,gerbera:.5,carn:.5};
const WIDEF={tulip:1.3};
function headSprite(t,ci){const col=FL[t].cols[ci]||FL[t].cols[0];return IMG[col[3]]}

/* ---------- کارت تبریک ---------- */
function drawCard(card,W=768,H=512){
 const c=mkC(W,H),x=c.getContext('2d'),m=card.m,txt=(card.text||'').trim();
 const bg={kraft:'#c9a572',water:'#fbf7f0',rose:'#5e1129',noir:'#15111a',photo:'#fbfaf7'}[m];
 x.fillStyle=bg;x.fillRect(0,0,W,H);
 const R=rngf(5);let ink='#3a2a1a';
 if(m==='kraft'){for(let i=0;i<1400;i++){x.strokeStyle=R()>.5?'rgba(255,255,255,.08)':'rgba(70,40,10,.1)';x.lineWidth=1;const px=R()*W,py=R()*H,l=R()*12+3,a=R()*6.28;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke()}
  x.setLineDash([10,8]);x.strokeStyle='#5b4326';x.lineWidth=3;x.strokeRect(28,28,W-56,H-56);x.setLineDash([]);
  x.strokeStyle='#5b4326';x.lineWidth=3;x.lineCap='round';x.beginPath();x.moveTo(W/2,112);x.quadraticCurveTo(W/2+6,70,W/2+2,40);x.stroke();for(let i=0;i<4;i++){const yy=100-i*17,s=i%2?1:-1;x.beginPath();x.ellipse(W/2+s*16,yy,14,6,s*.7,0,7);x.stroke()}
  ink='#3a2512'}
 else if(m==='water'){
  const blob=(cx,cy,r,col)=>{const g=x.createRadialGradient(cx,cy,r*.1,cx,cy,r);g.addColorStop(0,col+'cc');g.addColorStop(1,col+'00');x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,7);x.fill()};
  blob(W*.9,H*.95,260,'#ee8fae');blob(W*.78,H*1.0,220,'#f6b79c');blob(W*.98,H*.7,170,'#c79bd6');blob(W*.05,H*.05,220,'#a9d2b1');blob(W*.15,H*.0,170,'#f2c1d2');
  x.strokeStyle='#4f8a5e';x.lineWidth=3;x.lineCap='round';for(let k=0;k<3;k++){const bx=W*(.78+.06*k),by=H*.98;x.beginPath();x.moveTo(bx,by);x.quadraticCurveTo(bx-30+k*20,H*(.7+.03*k),bx-10,H*(.52+.04*k));x.stroke();for(let i=0;i<5;i++){const t=.2+i*.16,lx=bx-10-18*(1-t)*(i%2?-1:1),ly=by-(by-H*(.52+.04*k))*t;x.fillStyle='rgba(79,138,94,.7)';x.beginPath();x.ellipse(lx,ly,16,6,(i%2?-.6:.6),0,7);x.fill()}}
  ink='#4a2540'}
 else if(m==='rose'){
  x.strokeStyle='#d9b66a';x.lineWidth=3;x.strokeRect(26,26,W-52,H-52);x.lineWidth=1.5;x.strokeRect(40,40,W-80,H-80);
  x.fillStyle='#d9b66a';x.beginPath();const hx=W/2,hy=92;x.moveTo(hx,hy+22);x.bezierCurveTo(hx-46,hy-12,hx-22,hy-44,hx,hy-18);x.bezierCurveTo(hx+22,hy-44,hx+46,hy-12,hx,hy+22);x.fill();
  ink='#f3e3c3'}
 else if(m==='noir'){
  x.strokeStyle='#c9a24f';x.lineWidth=2;x.strokeRect(34,34,W-68,H-68);
  x.strokeStyle='#c9a24f';x.lineWidth=2;const cx=W/2,cy=96;for(let i=0;i<8;i++){x.beginPath();x.ellipse(cx,cy-18,8,22,i*PI/4,0,7);x.stroke()}x.beginPath();x.arc(cx,cy-18,5,0,7);x.stroke();x.beginPath();x.moveTo(cx,cy+8);x.lineTo(cx,cy+50);x.stroke();
  ink='#d9b868'}
 else if(m==='photo'){
  const ph=card.photoImg;const pw=W-80,pH=Math.round(H*.6);
  if(ph&&ph.width){const rr=Math.max(pw/ph.width,pH/ph.height),sw=pw/rr,sh=pH/rr;x.drawImage(ph,(ph.width-sw)/2,(ph.height-sh)/2,sw,sh,40,40,pw,pH)}
  else{const g=x.createLinearGradient(0,40,pw,pH);g.addColorStop(0,'#efd9d4');g.addColorStop(1,'#d7c3e0');x.fillStyle=g;x.fillRect(40,40,pw,pH);x.fillStyle='rgba(60,30,60,.45)';x.font='500 30px Vazirmatn,Tahoma';x.textAlign='center';x.direction='rtl';x.fillText('عکس شما اینجا قرار می‌گیرد',W/2,40+pH/2+10)}
  ink='#2f2230'}
 const hasPh=m==='photo';
 const box={x:70,w:W-140,top:hasPh?Math.round(H*.6)+60:(m==='kraft'||m==='rose'||m==='noir'?150:70),bot:H-62};
 let fs=hasPh?34:42,lines=[];const fam='Vazirmatn,Tahoma,sans-serif';
 const T0=txt||'متن کارت تبریک شما اینجا نوشته می‌شود';
 for(;fs>=22;fs-=2){x.font=`500 ${fs}px ${fam}`;x.direction='rtl';lines=[];T0.split('\n').forEach(par=>{let cur='';par.split(/\s+/).forEach(wd=>{const tt=cur?cur+' '+wd:wd;if(x.measureText(tt).width>box.w&&cur){lines.push(cur);cur=wd}else cur=tt});lines.push(cur)});if(lines.length*fs*1.55<=box.bot-box.top)break}
 x.fillStyle=txt?ink:ink+'88';x.textAlign='center';x.direction='rtl';x.font=`500 ${fs}px ${fam}`;
 const tot=lines.length*fs*1.55,y0=box.top+((box.bot-box.top)-tot)/2+fs*1.1;
 lines.forEach((l,i)=>x.fillText(l,W/2,y0+i*fs*1.55));
 return c;
}
window.SC={drawCard};

/* ---------- ابزار چیدمان ---------- */
function shuffle(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function relax(P,iters){ // کنار زدن گل‌های روی‌هم‌افتاده
 for(let k=0;k<iters;k++){for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j];let dx=b.x-a.x,dy=(b.y-a.y)/(a.sy||1),d=Math.hypot(dx,dy)||.01;const m=(a.d+b.d)*.5*.8;if(d<m){const f=(m-d)/d*.5;a.x-=dx*f*.5;b.x+=dx*f*.5;a.y-=dy*f*.5*(a.sy||1);b.y+=dy*f*.5*(b.sy||1)}}
  P.forEach(p=>{if(p.keep)p.keep(p)})}
}
function headList(cfg,rnd){
 const heads=[];ORDER.forEach(t=>{const it=cfg.items[t];if(!it||!FL[t]||FL[t].filler||!(it[0]>0))return;for(let i=0;i<it[0];i++)heads.push({t,ci:it[1]||0})});
 return shuffle(heads,rnd);
}
function fillList(cfg){const f=[];ORDER.forEach(t=>{const it=cfg.items[t];if(it&&FL[t]&&FL[t].filler&&it[0]>0)for(let i=0;i<it[0];i++)f.push({t,ci:it[1]||0})});return f}
const bloomF=b=>b==='bud'?.84:b==='open'?1.12:1;

/* ---------- چیدمان دسته‌گل ---------- */
function layoutBouquet(cfg){
 const rnd=rngf((cfg.seed||7)*7919+13),M=cfg.model,sz=cfg.size;
 const heads=headList(cfg,rnd),fills=fillList(cfg);
 const R0={S:190,M:250,L:318}[sz]*({wrap:1,hand:.92,posy:.8,arm:1.1}[M]);
 const stemF=(cfg.stem||50)/50;
 const tail=({wrap:240,hand:420,posy:150,arm:330}[M])*(M==='hand'?stemF:(.8+.2*stemF));
 const n=Math.max(1,heads.length);
 let sumD=0;heads.forEach(h=>sumD+=DIA[h.t]*DIA[h.t]);
 const bf=bloomF(cfg.bloom);
 let u=R0*Math.sqrt(PI*1.12/(.78*Math.max(.5,sumD)));u=Math.max(74,Math.min(190,u))*bf;
 const Re=Math.sqrt(.78*sumD*u*u/(PI*1.12));
 const cy=-(Re*.95+(M==='hand'?170:100)),sy=.8;
 const P=heads.map((h,i)=>{const r=Re*Math.sqrt((i+.5)/n),a=i*GOLD+rnd()*.3;return Object.assign(h,{x:Math.cos(a)*r,y:Math.sin(a)*r*sy,d:DIA[h.t]*u,sy,r})});
 relax(P,26);
 P.forEach(p=>{const r=Math.hypot(p.x,p.y/sy)/Re;p.rr=Math.min(1.2,r);p.y+=cy;
  const ang=Math.atan2(p.x,-(p.y-cy)/sy);p.rot=ang*.55*Math.min(1,r)+(rnd()-.5)*.25;p.sc=(1.1-.2*Math.min(1,r))});
 P.sort((a,b)=>b.rr-a.rr); // بیرونی‌ها اول، مرکزی‌ها روی‌شون
 // پرکننده‌ها (ژیپسوفیلا)
 const F=fills.map((f,i)=>{const a=-PI+ (i+.5)/Math.max(1,fills.length)*PI*(1.5)-PI*.25+ (rnd()-.5)*.3,rr=Re*(.82+rnd()*.35);return Object.assign(f,{x:Math.cos(a)*rr*1.05,y:cy+Math.sin(a)*rr*.82,rot:Math.cos(a)*.5+(rnd()-.5)*.3,w:Re*(.55+rnd()*.18)*(bf>1?1.05:1)})});
 // سبزینه
 const G=[];const gn=cfg.green.n||0;
 for(let i=0;i<gn;i++){const a=-PI*.95+(i+.5)/gn*PI*.9+(rnd()-.5)*.2,rr=Re*(.85+rnd()*.15);G.push({k:cfg.green.k,x:Math.cos(a)*rr*.95,y:cy+Math.sin(a)*rr*.8+4,rot:Math.cos(a)*.9+(rnd()-.5)*.2+0,w:Re*(.5+rnd()*.18),fl:rnd()>.5})}
 const lay={kind:'bouquet',cfg,heads:P,fills:F,greens:G,Re,cy,tail,M,rnd,u};
 const paper=M!=='hand';
 lay.paper=paper;lay.Wt=Re*1.2;lay.yt=cy-Re*.5;lay.Ww=Re*.2;lay.Wb=Re*(M==='posy'?.7:.55);
 lay.bow={x:0,y:6,w:Re*({S:.78,M:.95,L:1.15}[cfg.ribbon.w]||.95)*(M==='posy'?.85:1)};
 const topY=cy-Re*(gn>0?1.3:1.12)-u*.4;
 lay.bb={x0:-Math.max(Re*1.32,lay.Wt*1.08),x1:Math.max(Re*1.32,lay.Wt*1.08),y0:topY,y1:paper?tail+42:tail};
 if(cfg.card.on){const cw=Math.max(150,Re*.7);lay.card={x:Re*.5+cw*.15,y:Re*.1+14,w:cw,h:cw*2/3,rot:.1};lay.bb.x1=Math.max(lay.bb.x1,lay.card.x+cw*.7);lay.bb.y1=Math.max(lay.bb.y1,lay.card.y+cw*.9)}
 lay.anchors={heads:{x:0,y:cy,w:Re*2.7},bow:{x:0,y:0,w:Re*1.9},card:lay.card?{x:lay.card.x,y:lay.card.y+lay.card.h*.3,w:lay.card.w*2.3}:{x:0,y:0,w:Re*2},pack:{x:0,y:-Re*.15,w:Re*3.2}};
 return lay;
}

/* ---------- چیدمان باکس ---------- */
const BOXD={round:{a:1,b:1},square:{a:.92,b:.92},rect:{a:1.4,b:.74},heart:{a:1.08,b:1}};
const inHeart=(x,y)=>{const X=x*1.22,Y=-y*1.22+.1;const q=X*X+Y*Y-1;return q*q*q-X*X*Y*Y*Y<=0};
function shapePath(x,model,a,b,k,dy){ // مسیر رویه‌ی باکس (از نمای بالا، فشرده)
 x.beginPath();
 if(model==='round'){x.ellipse(0,dy,a,b*k,0,0,PI*2)}
 else if(model==='heart'){for(let i=0;i<=64;i++){const t=i/64*PI*2,hx=16*Math.pow(Math.sin(t),3),hy=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);const px=hx/17*a,py=-(hy+4)/17*b*k*1.25+dy-b*k*.05;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath()}
 else{const r=Math.min(a,b*k)*.18,t=b*k,ts=.94;x.moveTo(-a*ts+r,dy-t);x.lineTo(a*ts-r,dy-t);x.quadraticCurveTo(a*ts,dy-t,a*ts,dy-t+r);x.lineTo(a,dy+t-r);x.quadraticCurveTo(a,dy+t,a-r,dy+t);x.lineTo(-a+r,dy+t);x.quadraticCurveTo(-a,dy+t,-a,dy+t-r);x.lineTo(-a*ts,dy-t+r);x.quadraticCurveTo(-a*ts,dy-t,-a*ts+r,dy-t);x.closePath()}
}
function layoutBox(cfg){
 const rnd=rngf((cfg.seed||7)*7919+29),M=cfg.model,sz=cfg.size;
 const base={S:170,M:225,L:290}[sz],dim=BOXD[M],a=base*dim.a,b=base*dim.b,k=.5,h=base*.8;
 const heads=headList(cfg,rnd),fills=fillList(cfg),n=Math.max(1,heads.length);
 let sumD=0;heads.forEach(q=>sumD+=DIA[q.t]*DIA[q.t]);
 const areaFlat=M==='heart'?PI*a*b*.78:M==='round'?PI*a*b:4*a*b*.9;
 const bf=bloomF(cfg.bloom);
 let u=Math.sqrt(areaFlat*.92/(.78*Math.max(.5,sumD)))*1.02;u=Math.max(56,Math.min(150,u*.8))*bf;
 // نقاط داخل شکل
 const pts=[];const need=n;
 for(let i=0;i<need*6&&pts.length<need;i++){let x,y;
  if(M==='round'||M==='heart'){const r=Math.sqrt((i+.5)/(need*2.4)),th=i*GOLD;x=Math.cos(th)*r;y=Math.sin(th)*r;if(r>1)continue}
  else{x=((.5+i*.7548776662)%1)*2-1;y=((.5+i*.5698402909)%1)*2-1}
  const ux=x*.88,uy=y*.88;if(M==='heart'&&!inHeart(ux,uy))continue;
  pts.push([ux,uy])}
 while(pts.length<need)pts.push([(rnd()-.5)*1.2,(rnd()-.5)*1.2]);
 const P=heads.map((h,i)=>Object.assign(h,{x:pts[i][0]*a,y:pts[i][1]*b*k*1.05,fx:pts[i][0],fy:pts[i][1],d:DIA[h.t]*u,sy:k}));
 relax(P,18);
 P.forEach(p=>{const r=Math.min(1,Math.hypot(p.fx,p.fy));p.dome=(1-r*r);p.rot=(rnd()-.5)*.35+p.fx*.25;p.sc=1+.08*p.dome});
 P.sort((p,q)=>p.y-q.y);
 const F=fills.map((f,i)=>{const th=i*GOLD*1.7,r=.55+rnd()*.4;return Object.assign(f,{x:Math.cos(th)*a*r*.95,y:Math.sin(th)*b*k*r*.95,w:u*(.95+rnd()*.5),rot:(rnd()-.5)*.8})});
 const G=[];const gn=cfg.green.n||0;
 for(let i=0;i<gn;i++){const th=-PI*.9+(i+.5)/gn*PI*.8;G.push({k:cfg.green.k,x:Math.cos(th)*a*.92,y:Math.sin(th)*b*k*.9-u*.1,w:u*1.6,rot:Math.cos(th)*1.0+(rnd()-.5)*.2,fl:rnd()>.5})}
 const lay={kind:'box',cfg,heads:P,fills:F,greens:G,a,b,k,h,M,u,rnd};
 const top=-h-u*1.45-(gn>0?u*1.0:0);
 lay.bb={x0:-a*1.08,x1:a*1.08,y0:top,y1:b*k+h*0+12};
 lay.top=-h;
 lay.bow={x:0,y:b*k+8-h*.5,w:a*.5*({S:.8,M:1,L:1.2}[cfg.ribbon.w]||1)};
 if(cfg.card.on){const cw=Math.max(150,a*.62);lay.card={x:a*.62,y:-h-u*.55,w:cw,h:cw*2/3,rot:.16,stick:true};lay.bb.y0=Math.min(lay.bb.y0,lay.card.y-cw*.5);lay.bb.x1=Math.max(lay.bb.x1,lay.card.x+cw*.6)}
 lay.anchors={heads:{x:0,y:-h-u*.3,w:a*2.4},bow:{x:0,y:lay.bow.y,w:a*1.3},card:lay.card?{x:lay.card.x,y:lay.card.y,w:lay.card.w*2.4}:{x:0,y:-h,w:a*2},pack:{x:0,y:-h*.4,w:a*2.5}};
 lay.top=-h;
 buildSide(lay);
 return lay;
}
function buildSide(lay){ // دیواره‌ی جلویی باکس (یک‌بار ساخته و نگه داشته می‌شه)
 const{a,b,k,h,M,cfg}=lay,pad=30;const W=a*2+pad*2,H=h+b*k*2+pad*2;
 const c=mkC(W,H),x=c.getContext('2d');lay.sideOff={x:-W/2,y:-h-b*k-pad};
 x.translate(W/2,pad+b*k+h);
 // استامپ مقطع تا ضخامت
 const col=BOXCOL[cfg.boxCol]?BOXCOL[cfg.boxCol][1]:'#e9a6bd';
 for(let i=h;i>=0;i-=1.5){shapePath(x,M,a,b,k,i-h);x.fillStyle=col;x.fill()}
 x.globalCompositeOperation='source-atop';
 const g=x.createLinearGradient(-a,0,a,0);g.addColorStop(0,'rgba(0,0,0,.34)');g.addColorStop(.18,'rgba(0,0,0,.05)');g.addColorStop(.42,'rgba(255,255,255,.2)');g.addColorStop(.7,'rgba(0,0,0,.06)');g.addColorStop(1,'rgba(0,0,0,.4)');
 x.fillStyle=g;x.fillRect(-a-5,-h-b*k-5,a*2+10,h+b*k*2+10);
 const g2=x.createLinearGradient(0,-h,0,b*k);g2.addColorStop(0,'rgba(255,255,255,.1)');g2.addColorStop(1,'rgba(0,0,0,.22)');x.fillStyle=g2;x.fillRect(-a-5,-h-b*k-5,a*2+10,h+b*k*2+10);
 const tx=IMG.paper;if(tx){x.globalAlpha=.16;x.drawImage(tx,-a,-h-b*k,a*2,h+b*k*2);x.globalAlpha=1}
 if(cfg.ribbon.on){const rc=RIBS[cfg.ribbon.c]?RIBS[cfg.ribbon.c][1]:'#b2162f',bw={S:h*.1,M:h*.15,L:h*.22}[cfg.ribbon.w]||h*.15;
  for(let i=h*.5+bw/2;i>=h*.5-bw/2;i-=1.5){shapePath(x,M,a,b,k,-i);x.strokeStyle=rc;x.lineWidth=3;x.stroke()}
  const rg=x.createLinearGradient(-a,0,a,0);rg.addColorStop(0,'rgba(0,0,0,.3)');rg.addColorStop(.45,'rgba(255,255,255,.22)');rg.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=rg;x.fillRect(-a-5,-h*.5-bw/2-b*k,a*2+10,bw+b*k*2)}
 x.globalCompositeOperation='destination-out';x.fillStyle='#000';shapePath(x,M,a,b,k,-h);x.fill();
 x.globalCompositeOperation='source-over';
 x.save();x.beginPath();x.rect(-a-20,-h+1,a*2+40,b*k+30);x.clip();shapePath(x,M,a,b,k,-h);x.lineWidth=6;x.strokeStyle=shadeHex(col,.25);x.stroke();x.restore();
 lay.side=c;
}

/* ---------- نقاشی اجزا ---------- */
function drawHead(x,h,s,pop){
 const im=headSprite(h.t,h.ci);if(!im)return;
 const w=h.d*(WIDEF[h.t]||1)*(h.sc||1)*s*pop,ratio=CROP[h.t]*im.height/im.width,hh=w*ratio;
 x.save();x.translate(h.x,h.y);x.rotate(h.rot||0);
 if(h.sy)x.scale(1,.9);
 // سایه‌ی تماسی
 const sg=x.createRadialGradient(0,w*.04,w*.2,0,w*.04,w*.62);sg.addColorStop(0,'rgba(20,8,12,.28)');sg.addColorStop(1,'rgba(20,8,12,0)');x.fillStyle=sg;x.beginPath();x.ellipse(0,w*.04,w*.62,w*.58,0,0,PI*2);x.fill();
 const ay=ANCH[h.t]*hh;
 x.drawImage(im,0,0,im.width,CROP[h.t]*im.height,-w/2,-ay,w,hh);
 x.restore();
}
function drawFill(x,f,s,pop){
 const im=headSprite(f.t,f.ci);if(!im)return;const w=f.w*s*pop,hh=w*im.height/im.width;
 x.save();x.translate(f.x,f.y);x.rotate(f.rot||0);x.drawImage(im,-w/2,-hh*.55,w,hh);x.restore();
}
function drawGreen(x,g,s,pop){
 const im=IMG[g.k==='euc'?(g.fl?'euc':'euc2'):(g.fl?'rus':'fern')];if(!im)return;
 const w=g.w*s*pop,hh=w*im.height/im.width;
 x.save();x.translate(g.x,g.y);x.rotate(g.rot);x.scale(g.fl?-1:1,1);x.drawImage(im,-w/2,-hh*.88,w,hh);x.restore();
}
function paintPaper(x,fn,hex,lay,style,pivot,alpha){
 x.save();fn();const base=hex;
 x.fillStyle=base;x.globalAlpha=alpha;x.fill();x.globalAlpha=1;x.clip();
 const R=lay.Re,bb={x:-lay.Wt*1.3,y:lay.yt-40,w:lay.Wt*2.6,h:lay.tail+lay.Re*2};
 // تکسچر ابریشمی واقعی
 const tx=IMG.paper;if(tx){x.globalCompositeOperation='soft-light';x.globalAlpha=style==='kraft'?.3:.5;x.drawImage(tx,bb.x,bb.y,bb.w,bb.h);x.globalAlpha=1;x.globalCompositeOperation='source-over'}
 // چین‌های شعاعی از گره‌ی دسته
 const rnd=rngf((lay.cfg.seed||7)*31+(fn.id||1));const N=18;
 for(let i=0;i<N;i++){const a0=-PI*.98+i*(PI*.96/N),a1=a0+PI*.96/N*(.4+rnd()*.5);const L=R*3.2;
  x.beginPath();x.moveTo(pivot[0],pivot[1]);x.lineTo(pivot[0]+Math.cos(a0)*L,pivot[1]+Math.sin(a0)*L);x.lineTo(pivot[0]+Math.cos(a1)*L,pivot[1]+Math.sin(a1)*L);x.closePath();
  x.fillStyle=i%2?`rgba(255,255,255,${.08+rnd()*.12})`:`rgba(0,0,0,${.05+rnd()*.08})`;x.fill()}
 // سایه نزدیک گره
 const g=x.createRadialGradient(pivot[0],pivot[1],0,pivot[0],pivot[1],R*1.1);g.addColorStop(0,'rgba(0,0,0,.2)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(bb.x,bb.y,bb.w,bb.h);
 x.restore();
}
function paperPaths(lay,x){
 const{Wt,yt,Ww,Wb,tail,Re,cy}=lay;const rnd=rngf((lay.cfg.seed||7)*17+5);
 const wave=(x0,y0,x1,y1,n,amp)=>{for(let i=1;i<=n;i++){const t=i/n,px=x0+(x1-x0)*t,py=y0+(y1-y0)*t+(i<n?(rnd()-.5)*amp:0);const cx=x0+(x1-x0)*(t-.5/n),cyy=y0+(y1-y0)*(t-.5/n)+((i%2)?-amp*.5:amp*.5);x.quadraticCurveTo(cx,cyy,px,py)}};
 const back=()=>{x.beginPath();x.moveTo(-Wt,yt+Re*.35);wave(-Wt,yt+Re*.35,-Wt*.5,yt-6,3,Re*.18);wave(-Wt*.5,yt-6,Wt*.5,yt-14,4,Re*.16);wave(Wt*.5,yt-14,Wt,yt+Re*.3,3,Re*.16);
  x.bezierCurveTo(Wt*1.05,yt+Re*.9,Ww*3,-Re*.45,Ww,0);x.lineTo(Wb,tail*.55);wave(Wb,tail*.55,Wb*.75,tail+22,2,18);wave(Wb*.75,tail+22,-Wb*.75,tail+30,4,16);wave(-Wb*.75,tail+30,-Wb,tail*.55,2,18);x.lineTo(-Ww,0);x.bezierCurveTo(-Ww*3,-Re*.45,-Wt*1.05,yt+Re*.9,-Wt,yt+Re*.35);x.closePath()};
 const left=()=>{x.beginPath();x.moveTo(-Wt*1.04,yt+Re*.75);x.bezierCurveTo(-Wt*.75,yt+Re*.9,-Re*.35,-Re*.55,Re*.1,-Re*.06);x.lineTo(Ww*.3,0);x.lineTo(Wb*.82,tail*.6);wave(Wb*.82,tail*.6,Wb*.55,tail+14,2,12);wave(Wb*.55,tail+14,-Wb*.8,tail+22,4,14);wave(-Wb*.8,tail+22,-Wb,tail*.55,2,14);x.lineTo(-Ww*1.1,0);x.bezierCurveTo(-Ww*3,-Re*.45,-Wt*1.08,yt+Re*1.05,-Wt*1.04,yt+Re*.75);x.closePath()};
 const right=()=>{x.beginPath();x.moveTo(Wt*1.04,yt+Re*.75);x.bezierCurveTo(Wt*.75,yt+Re*.95,Re*.35,-Re*.5,-Re*.12,-Re*.04);x.lineTo(-Ww*.3,0);x.lineTo(-Wb*.82,tail*.6);wave(-Wb*.82,tail*.6,-Wb*.55,tail+14,2,12);wave(-Wb*.55,tail+14,Wb*.8,tail+22,4,14);wave(Wb*.8,tail+22,Wb,tail*.55,2,14);x.lineTo(Ww*1.1,0);x.bezierCurveTo(Ww*3,-Re*.45,Wt*1.08,yt+Re*1.05,Wt*1.04,yt+Re*.75);x.closePath()};
 back.id=1;left.id=2;right.id=3;return{back,left,right};
}
function drawStems(x,lay,long){
 const n=Math.min(9,Math.max(4,lay.heads.length));const c=lay.cfg;
 x.save();x.lineCap='round';
 for(let i=0;i<n;i++){const t=(i/(n-1)-.5),x0=t*lay.Re*.18,x1=t*lay.Re*(long?.55:.5),yb=lay.tail+(long?0:14);
  const gr=x.createLinearGradient(0,-lay.Re,0,yb);gr.addColorStop(0,'#52803a');gr.addColorStop(1,'#34552a');x.strokeStyle=gr;x.lineWidth=long?12:10;x.beginPath();x.moveTo(x0*.3,-lay.Re*.2);x.quadraticCurveTo(x0,yb*.3,x1,yb);x.stroke();
  x.strokeStyle='rgba(180,220,140,.35)';x.lineWidth=3;x.beginPath();x.moveTo(x0*.3-2,-lay.Re*.2);x.quadraticCurveTo(x0-2,yb*.3,x1-2,yb);x.stroke()}
 x.restore();
}
function longStemsToHeads(x,lay){
 x.save();x.lineCap='round';x.lineWidth=7;
 lay.heads.forEach((h,i)=>{const t=(i%7)/6-.5,x0=t*lay.Re*.2,gr=x.createLinearGradient(h.x,h.y,0,0);gr.addColorStop(0,'#4a7a36');gr.addColorStop(1,'#3a6030');x.strokeStyle=gr;x.beginPath();x.moveTo(h.x,h.y);x.quadraticCurveTo(h.x*.5,h.y*.4,x0,0);x.stroke()});x.restore();
}
function drawRibbonBand(x,lay){
 const c=lay.cfg;if(!c.ribbon.on)return;const hex=RIBS[c.ribbon.c][1],bh={S:20,M:34,L:52}[c.ribbon.w]||34,ww=lay.Ww*1.9;
 x.save();x.beginPath();x.moveTo(-ww,-bh/2+4);x.quadraticCurveTo(0,-bh/2+16,ww,-bh/2+4);x.lineTo(ww,bh/2+4);x.quadraticCurveTo(0,bh/2+16,-ww,bh/2+4);x.closePath();
 const g=x.createLinearGradient(-ww,0,ww,0);g.addColorStop(0,shadeHex(hex,-.3));g.addColorStop(.35,shadeHex(hex,.3));g.addColorStop(.7,hex);g.addColorStop(1,shadeHex(hex,-.35));
 x.globalAlpha=c.ribbon.style==='organza'?.82:1;x.fillStyle=g;x.fill();x.globalAlpha=1;
 if(c.ribbon.style==='grosgrain'){x.clip();x.strokeStyle='rgba(0,0,0,.14)';x.lineWidth=1;for(let i=-ww;i<ww;i+=4){x.beginPath();x.moveTo(i,-bh);x.lineTo(i,bh);x.stroke()}}
 x.restore();
}
function drawJute(x,lay,y0){
 const ww=lay.Ww*1.7;x.save();x.lineCap='round';
 for(let i=0;i<5;i++){const y=y0+(i-2)*7;x.strokeStyle=i%2?'#a37d4b':'#c39a62';x.lineWidth=4.2;x.beginPath();x.moveTo(-ww,y-2);x.quadraticCurveTo(0,y+9,ww,y-2);x.stroke();
  x.strokeStyle='rgba(60,35,10,.35)';x.lineWidth=1;x.beginPath();x.moveTo(-ww,y+1);x.quadraticCurveTo(0,y+12,ww,y+1);x.stroke()}
 x.strokeStyle='#b58b55';x.lineWidth=5;x.beginPath();x.moveTo(ww*.1,y0+8);x.quadraticCurveTo(ww*.5,y0+50,ww*.38,y0+90);x.moveTo(-ww*.05,y0+8);x.quadraticCurveTo(-ww*.35,y0+44,-ww*.25,y0+80);x.stroke();
 x.fillStyle='#b58b55';x.beginPath();x.arc(0,y0+8,9,0,7);x.fill();x.restore();
}
function drawBow(x,lay,s){
 const c=lay.cfg;if(!c.ribbon.on)return;const im=bowSprite(c.ribbon.c);if(!im)return;
 const w=lay.bow.w*s,hh=w*im.height/im.width;
 x.save();if(c.ribbon.style==='organza')x.globalAlpha=.9;
 x.shadowColor='rgba(30,10,20,.3)';x.shadowBlur=14;x.shadowOffsetY=6;
 x.drawImage(im,lay.bow.x-w/2,lay.bow.y-hh*.34,w,hh);x.restore();
}
function drawCardObj(x,lay,cardImg,t){
 const cd=lay.card;if(!cd||!cardImg)return;
 x.save();const sw=Math.sin((t||0)*1.2)*.02;
 if(cd.stick){x.strokeStyle='#8a6a3c';x.lineWidth=6;x.lineCap='round';x.beginPath();x.moveTo(cd.x,cd.y+cd.h*.45);x.lineTo(cd.x-12,lay.top+14);x.stroke()}
 else{x.strokeStyle='rgba(180,150,100,.95)';x.lineWidth=2.5;x.beginPath();x.moveTo(lay.bow.x+lay.bow.w*.2,lay.bow.y);x.quadraticCurveTo(cd.x-cd.w*.4,cd.y-cd.h*.2,cd.x,cd.y-cd.h*.5);x.stroke()}
 x.translate(cd.x,cd.y);x.rotate(cd.rot+sw);
 x.shadowColor='rgba(20,10,20,.4)';x.shadowBlur=18;x.shadowOffsetY=8;x.fillStyle='#fff';x.fillRect(-cd.w/2-4,-cd.h/2-4,cd.w+8,cd.h+8);x.shadowColor='transparent';
 x.drawImage(cardImg,-cd.w/2,-cd.h/2,cd.w,cd.h);
 x.fillStyle='rgba(255,255,255,.25)';x.beginPath();x.arc(0,-cd.h/2+3,6,0,7);x.fill();x.restore();
}

/* ---------- ترسیم کامل یک چیدمان ---------- */
function popOf(h,now){if(h.born==null)return 1;const k=(now-h.born)/700;if(k>=1){return 1}if(k<=0)return .001;const c1=1.5,c3=c1+1;return Math.max(.001,1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2))}
function drawLayout(x,lay,st){
 st=st||{};const now=st.now||0,s=1,cfg=lay.cfg;
 if(lay.kind==='bouquet'){
  const hex=PAPERS[cfg.paper.c]?PAPERS[cfg.paper.c][1]:'#efc2cf',style=cfg.paper.style;
  if(lay.paper){
   drawStems(x,lay,false);
   const pp=paperPaths(lay,x),al=style==='tissue'?.88:1,piv=[0,0];
   paintPaper(x,pp.back,shadeHex(hex,-.12),lay,style,piv,al);
  }else{longStemsToHeads(x,lay);drawStems(x,lay,true)}
  lay.greens.forEach(g=>drawGreen(x,g,s,1));
  lay.fills.forEach(f=>drawFill(x,f,s,1));
  lay.heads.forEach(h=>drawHead(x,h,s,popOf(h,now)));
  if(lay.paper){
   const pp=paperPaths(lay,x),al=style==='tissue'?.9:1,piv=[0,0];
   paintPaper(x,pp.left,hex,lay,style,piv,al);paintPaper(x,pp.right,shadeHex(hex,-.06),lay,style,piv,al);
   // لبه‌ی روشن V
   x.save();x.strokeStyle='rgba(255,255,255,.4)';x.lineWidth=2.5;x.beginPath();x.moveTo(-lay.Wt*1.04,lay.yt+lay.Re*.75);x.bezierCurveTo(-lay.Wt*.75,lay.yt+lay.Re*.9,-lay.Re*.35,-lay.Re*.55,lay.Re*.1,-lay.Re*.06);x.stroke();
   x.beginPath();x.moveTo(lay.Wt*1.04,lay.yt+lay.Re*.75);x.bezierCurveTo(lay.Wt*.75,lay.yt+lay.Re*.95,lay.Re*.35,-lay.Re*.5,-lay.Re*.12,-lay.Re*.04);x.stroke();x.restore();
  }
  drawRibbonBand(x,lay);
  if(cfg.jute)drawJute(x,lay,cfg.ribbon.on?30:0);
  drawBow(x,lay,1);
  drawCardObj(x,lay,st.cardImg,st.time);
 }else{
  const{a,b,k,h,M}=lay,col=BOXCOL[cfg.boxCol]?BOXCOL[cfg.boxCol][1]:'#e9a6bd';
  // رویه و فوم
  x.save();shapePath(x,M,a,b,k,-h);x.fillStyle='#101c10';x.fill();x.lineWidth=0;x.restore();
  x.save();shapePath(x,M,a,b,k,-h);x.clip();
  const fg=x.createRadialGradient(0,-h,0,0,-h,a);fg.addColorStop(0,'#2e4a2c');fg.addColorStop(1,'#0e180e');x.fillStyle=fg;x.fillRect(-a,-h-b*k,a*2,b*k*2);x.restore();
  // سبزینه‌ی پشتی و پرکننده‌ها
  x.save();x.translate(0,-h);lay.greens.forEach(g=>drawGreen(x,g,s,1));lay.fills.filter((f,i)=>i%2===0).forEach(f=>drawFill(x,f,s,1));
  // گل‌ها از عقب به جلو
  lay.heads.forEach(hd=>{const pop=popOf(hd,now),dm=hd.dome||0;const q=Object.assign({},hd,{y:hd.y-hd.d*(.22+.25*dm)});drawHead(x,q,s,pop)});
  lay.fills.filter((f,i)=>i%2===1).forEach(f=>drawFill(x,f,s,1));
  x.restore();
  if(lay.card)drawCardObj(x,lay,st.cardImg,st.time);
  // دیواره‌ی جلو روی ته‌ساقه‌ها
  x.drawImage(lay.side,lay.sideOff.x,lay.sideOff.y);
  // پاپیون جلوی باکس
  if(cfg.ribbon.on){const im=bowSprite(cfg.ribbon.c);if(im){const w=lay.bow.w*s,hh=w*im.height/im.width;x.save();x.shadowColor='rgba(30,10,20,.3)';x.shadowBlur=14;x.shadowOffsetY=6;x.drawImage(im,lay.bow.x-w/2,lay.bow.y-hh*.45,w,hh);x.restore()}}
  if(cfg.jute){x.save();x.strokeStyle='#b58b55';x.lineWidth=5;x.lineCap='round';x.beginPath();x.moveTo(-a*.9,-h*.25+b*k*.55);x.quadraticCurveTo(0,-h*.25+b*k*1.2,a*.9,-h*.25+b*k*.55);x.stroke();x.restore()}
 }
}

/* ---------- نمایشگر ---------- */
const LIGHTS={studio:{c:[255,255,255],a:0,b:1},morning:{c:[205,226,255],a:.16,b:1.05},golden:{c:[255,160,80],a:.2,b:1.02},night:{c:[55,62,160],a:.42,b:.78}};
class Viewer{
 constructor(el,opt={}){
  this.el=el;this.opt=opt;this.vis=true;this.dirty=true;this.cur=null;this.known=new Set();this.idle=opt.auto?1:0;
  this.accent='#e8789a';this.rig={fx:0,fy:0,zoom:1,tfx:0,tfy:0,tzoom:1,sway:0,drag:0,tdrag:0,pulse:0};this.mouse={x:0,y:0,sx:0,sy:0};this.light=LIGHTS.studio;this.lc={a:0,b:1,c:[255,255,255]};
  this.focusName='all';this.cardImg=null;this.cardKey='';
  if(opt.thumb)return;
  const c=this.cv=document.createElement('canvas');c.style.cssText='width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab';el.appendChild(c);this.x=c.getContext('2d');
  this.layer=mkC(10,10);this.lx=this.layer.getContext('2d');
  this.motes=Array.from({length:opt.motes?Math.min(46,opt.motes):30},(_,i)=>({x:Math.random(),y:Math.random(),s:.4+Math.random()*.9,v:.01+Math.random()*.02,p:Math.random()*6.28}));
  this._bind();this._resize();
  this.ro=new ResizeObserver(()=>this._resize());this.ro.observe(el);
  this.io=new IntersectionObserver(es=>{this.vis=es[0].isIntersecting;if(this.vis)this.dirty=true},{threshold:0});this.io.observe(el);
  this._loop=this._loop.bind(this);this.raf=requestAnimationFrame(this._loop);
 }
 _bind(){
  const c=this.cv;let drag=null;
  c.addEventListener('pointerdown',e=>{drag={x:e.clientX,d:this.rig.tdrag};c.setPointerCapture(e.pointerId);c.style.cursor='grabbing';this.lastInput=performance.now()});
  c.addEventListener('pointermove',e=>{if(!drag)return;this.rig.tdrag=Math.max(-1,Math.min(1,drag.d+(e.clientX-drag.x)/260));this.dirty=true});
  const up=()=>{drag=null;this.rig.tdrag=0;c.style.cursor='grab'};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
  c.addEventListener('dblclick',()=>this.focus('all'));
  if(this.opt.parallax){addEventListener('pointermove',e=>{const r=this.el.getBoundingClientRect();this.mouse.x=((e.clientX-r.left)/r.width-.5)*2;this.mouse.y=((e.clientY-r.top)/r.height-.5)*2},{passive:true})}
 }
 _resize(){const w=this.el.clientWidth||300,h=this.el.clientHeight||300,d=Math.min(devicePixelRatio||1,2);this.W=w;this.H=h;this.dpr=d;this.cv.width=Math.round(w*d);this.cv.height=Math.round(h*d);this.layer.width=this.cv.width;this.layer.height=this.cv.height;this.dirty=true}
 _cardImage(cfg){
  if(!cfg.card.on){this.cardImg=null;return}
  const k=cfg.card.m+'|'+cfg.card.text+'|'+(cfg.card.photo?cfg.card.photo.length:0);
  if(k!==this.cardKey){this.cardKey=k;this.cardImg=drawCard(cfg.card,576,384)}
 }
 setConfig(cfg){
  const lay=cfg.kind==='box'?layoutBox(cfg):layoutBouquet(cfg);this._cardImage(cfg);
  const now=performance.now();let rank=0;const keys=new Set();
  lay.heads.slice().sort((p,q)=>p.rr!==undefined?q.rr-p.rr:p.y-q.y).forEach((h,i)=>{const k=h.t+h.ci+'#'+Math.round(h.x/8)+','+Math.round(h.y/8);h.key=k+'|'+i;keys.add(h.key)});
  // گل‌های تازه وارد با انیمیشن ظاهر می‌شن؛ مقایسه بر اساس تعداد هر نوع/رنگ
  const prevCount=this.counts||{},cnt={};
  lay.heads.forEach(h=>{const k=h.t+'-'+h.ci;cnt[k]=(cnt[k]||0)+1;if(cnt[k]>(prevCount[k]||0)||!this.cur){h.born=now+(this.cur?rank*40:(this.opt.stagger?rank*70:rank*28));rank++}});
  this.counts=cnt;this.cur={lay,cfg};this.cfg=cfg;this.lay=lay;
  const rk=Math.min(1,Math.max(0,0));
  this._fit(false);this.dirty=true;this.anim=true;
 }
 _fit(snap){
  const L=this.lay;if(!L)return;const b=L.bb,bw=b.x1-b.x0,bh=b.y1-b.y0;
  this.base={s:Math.min(this.W*.84/bw,this.H*(this.opt.thumb?.9:.76)/bh),cx:(b.x0+b.x1)/2,cy:(b.y0+b.y1)/2};
  this.focus(this.focusName,snap);
 }
 focus(name,snap){
  if(!this.base)return;this.focusName=name;const L=this.lay,B=this.base,r=this.rig;let fx=B.cx,fy=B.cy,zoom=1;
  const an=L.anchors[name];
  if(an){fx=an.x;fy=an.y;const bw=L.bb.x1-L.bb.x0;zoom=Math.max(1,Math.min(2.6,(bw*1.05)/an.w))}
  if(name==='pack'){zoom=Math.min(1.25,zoom)}
  r.tfx=fx;r.tfy=fy;r.tzoom=zoom;
  if(snap){r.fx=fx;r.fy=fy;r.zoom=zoom}
  this.dirty=true;
 }
 burst(hex,n){if(this.opt.thumb||!window.UFX)return;const r=this.el.getBoundingClientRect();UFX.shower(r.left+r.width/2,r.top+r.height*.42,n||24)}
 finale(){this.shine={t0:performance.now(),dur:1900};this.rig.pulse=1;this.dirty=true}
 setAccent(h){this.accent=h;this.dirty=true}
 setLight(n){this.light=LIGHTS[n]||LIGHTS.studio;this.dirty=true}
 _stepLight(k){const L=this.light,c=this.lc;let ch=false;for(let i=0;i<3;i++){if(Math.abs(c.c[i]-L.c[i])>.5){c.c[i]+=(L.c[i]-c.c[i])*k;ch=true}}if(Math.abs(c.a-L.a)>.002){c.a+=(L.a-c.a)*k;ch=true}if(Math.abs(c.b-L.b)>.002){c.b+=(L.b-c.b)*k;ch=true}return ch}
 _loop(now){
  this.raf=requestAnimationFrame(this._loop);
  if(!this.vis||document.hidden||!this.cur)return;
  const dt=Math.min(.1,(now-(this._lt||now))/1000);this._lt=now;const k=1-Math.exp(-dt*7),r=this.rig;let ch=false,amb=false;
  ['fx','fy','zoom','drag'].forEach(p=>{const t=r['t'+p],c=r[p];if(Math.abs(t-c)>(p==='zoom'?.0005:.05*(p==='drag'?.02:1))){r[p]=c+(t-c)*(p==='drag'?1-Math.exp(-dt*10):k);ch=true}});
  if(r.pulse>0){r.pulse=Math.max(0,r.pulse-dt/1.9);ch=true}
  if(this.anim){let any=false;this.lay.heads.forEach(h=>{if(h.born!=null){if(now-h.born<760)any=true;else h.born=null}});this.anim=any;ch=true}
  if(this._stepLight(1-Math.exp(-dt*4)))ch=true;
  if(this.shine){if(now-this.shine.t0>this.shine.dur)this.shine=null;ch=true}
  if(this.opt.breathe&&!matchMedia('(prefers-reduced-motion: reduce)').matches)amb=true;
  if(this.opt.parallax){const m=this.mouse;m.sx+=(m.x-m.sx)*(1-Math.exp(-dt*3));m.sy+=(m.y-m.sy)*(1-Math.exp(-dt*3))}
  if(amb&&!ch&&now-(this._lr||0)<40)return;
  if(ch||amb||this.dirty){this._render(now);this.dirty=false;this._lr=now}
 }
 _scene(x,now,withPed,W,H,B,view){
  const L=this.lay;
  x.save();
  const s=B.s*view.zoom;x.translate(W/2,H*(this.opt.thumb?.5:.47));
  // خمیدگی ملایم از بالا: چرخش حول پایه
  x.rotate(view.rot);x.scale(s,s);x.translate(-view.fx,-view.fy);
  if(withPed)this._pedestal(x,L);
  drawLayout(x,L,{now,cardImg:this.cardImg,time:now/1000});
  x.restore();
 }
 _pedestal(x,L){
  const b=L.bb,bw=b.x1-b.x0,rx=bw*.6,ry=rx*.2,y=b.y1-ry*.2;x.save();
  const sg=x.createRadialGradient(0,y+ry*.5,rx*.2,0,y+ry*.5,rx*1.05);sg.addColorStop(0,'rgba(30,10,30,.28)');sg.addColorStop(1,'rgba(30,10,30,0)');x.fillStyle=sg;x.beginPath();x.ellipse(0,y+ry*.5,rx*1.08,ry*1.15,0,0,PI*2);x.fill();
  x.fillStyle='#d8cbd0';x.beginPath();x.ellipse(0,y+ry*.28,rx,ry,0,0,PI*2);x.fill();
  const g=x.createLinearGradient(-rx,0,rx,0);g.addColorStop(0,'#e8dde1');g.addColorStop(.5,'#fbf6f4');g.addColorStop(1,'#e2d6db');x.fillStyle=g;x.beginPath();x.ellipse(0,y,rx,ry,0,0,PI*2);x.fill();
  x.strokeStyle=this.accent;x.lineWidth=rx*.018;x.globalAlpha=.8;x.beginPath();x.ellipse(0,y,rx*.97,ry*.96,0,0,PI*2);x.stroke();x.restore();
 }
 _render(now){
  const d=this.dpr,W=this.W,H=this.H,x=this.x,lx=this.lx,r=this.rig,B=this.base;if(!B)return;
  lx.setTransform(d,0,0,d,0,0);lx.clearRect(0,0,W,H);
  const t=now/1000,sw=this.opt.breathe?Math.sin(t*.9)*.012:0,mp=this.opt.parallax?this.mouse.sx*.03:0;
  const pulse=Math.sin(r.pulse*PI)*.07;
  const view={fx:r.fx+mp*-60,fy:r.fy,zoom:r.zoom*(1+pulse),rot:sw+r.drag*.12+mp};
  // پایه‌ی چرخش: پایین دسته
  this._scene(lx,now,true,W,H,B,view);
  // جلوه‌ی برق (شاین) هنگام نمایش نهایی
  if(this.shine){const q=(now-this.shine.t0)/this.shine.dur,gx=-W*.3+q*W*1.6;lx.save();lx.globalCompositeOperation='source-atop';const g=lx.createLinearGradient(gx-70,0,gx+70,H*.4);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');lx.fillStyle=g;lx.fillRect(0,0,W,H);lx.restore()}
  // نور صحنه
  const c=this.lc;if(c.a>.003){lx.save();lx.globalCompositeOperation='source-atop';lx.fillStyle=`rgba(${c.c[0]|0},${c.c[1]|0},${c.c[2]|0},${c.a})`;lx.fillRect(0,0,W,H);lx.restore()}
  x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,W,H);
  x.save();if(Math.abs(c.b-1)>.003)try{x.filter=`brightness(${c.b})`}catch(e){}
  x.drawImage(this.layer,0,0,this.cv.width,this.cv.height,0,0,W,H);x.restore();
  // ذرات نورانی
  if(!this.opt.thumb){x.save();x.globalCompositeOperation=this.light===LIGHTS.night?'lighter':'source-over';this.motes.forEach(m=>{m.y-=m.v*.016;if(m.y<-.05)m.y=1.05;const px=(m.x+Math.sin(t*.4+m.p)*.02)*W,py=m.y*H,a=(.18+.22*Math.sin(t*.8+m.p))*(this.light===LIGHTS.night?1.6:1);x.fillStyle=`rgba(255,244,230,${Math.max(0,a)})`;x.beginPath();x.arc(px,py,1.2+m.s*1.8,0,PI*2);x.fill()});x.restore()}
 }
 /* خروجی ثابت */
 _renderTo(cv,cfg,o){
  const lay=cfg.kind==='box'?layoutBox(cfg):layoutBouquet(cfg);const sv=[this.lay,this.cardImg,this.cardKey];
  const x=cv.getContext('2d');const W=cv.width,H=cv.height;
  if(o.bg){x.fillStyle=o.bg;x.fillRect(0,0,W,H)}
  this.lay=lay;this._cardImage(cfg);
  const b=lay.bb,bw=b.x1-b.x0,bh=b.y1-b.y0,s=Math.min(W*(o.fill||.86)/bw,H*(o.fill||.86)/bh*(o.ped?.9:1));
  x.save();x.translate(W/2,H/2+(o.ped?-H*.02:0));x.scale(s,s);x.translate(-(b.x0+b.x1)/2,-(b.y0+b.y1)/2);
  if(o.ped)this._pedestal(x,lay);drawLayout(x,lay,{now:0,cardImg:this.cardImg,time:0});x.restore();
  [this.lay,this.cardImg,this.cardKey]=sv;
 }
 snapshot(size,bg){const c=mkC(size,size);this._renderTo(c,this.cfg,{bg,ped:true,fill:.9});const o=mkC(size,size),x=o.getContext('2d');if(bg){x.fillStyle=bg;x.fillRect(0,0,size,size)}x.drawImage(c,0,0);return o.toDataURL('image/jpeg',.88)}
 snapshotFree(cfg,size){const c=mkC(size,size);this._renderTo(c,cfg,{ped:false,fill:.94});return c.toDataURL('image/png')}
 icon(type,hex,open,size){
  const ci=Math.max(0,FL[type].cols.findIndex(c=>c[1]===hex)),im=headSprite(type,ci);const c=mkC(size,size),x=c.getContext('2d');if(!im)return c.toDataURL();
  const cropH=CROP[type]*im.height,k=Math.min(size*.92/im.width,size*.92/cropH),w=im.width*k,h=cropH*k;
  x.shadowColor='rgba(40,10,20,.25)';x.shadowBlur=size*.05;x.shadowOffsetY=size*.025;x.drawImage(im,0,0,im.width,cropH,(size-w)/2,(size-h)/2,w,h);return c.toDataURL('image/png');
 }
 dispose(){cancelAnimationFrame(this.raf)}
}
window.Viewer=Viewer;
})();
