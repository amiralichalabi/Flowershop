/* ============ موتور سه‌بعدی گل (Three.js r128) ============ */
(function(){
const T=THREE;
const PI=Math.PI;
const rngf=seed=>{let a=(seed*2654435761)>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
function shadeHex(h,p){const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(p<0?v*(1+p):v+(255-v)*p)));return'#'+((1<<24)+(f(n>>16)<<16)+(f(n>>8&255)<<8)+f(n&255)).toString(16).slice(1)}
const mkC=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
function tex(c,srgb=true,rep){const t=new T.CanvasTexture(c);if(srgb)t.encoding=T.sRGBEncoding;t.anisotropy=4;if(rep){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rep[0],rep[1])}return t}

/* ---------- بافت گلبرگ‌ها ---------- */
const texCache={};
function petalTex(type,hex){
 const key=type+hex;if(texCache[key])return texCache[key];
 const W=128,H=256,c=mkC(W,H),x=c.getContext('2d'),b=mkC(W,H),y=b.getContext('2d');
 const r=Math.random;
 let g=x.createLinearGradient(0,H,0,0);
 if(type==='rose'){g.addColorStop(0,shadeHex(hex,.45));g.addColorStop(.25,shadeHex(hex,.12));g.addColorStop(.7,hex);g.addColorStop(1,shadeHex(hex,-.2))}
 else if(type==='lily'){g.addColorStop(0,'#dfe9a6');g.addColorStop(.18,shadeHex(hex,.35));g.addColorStop(.6,hex);g.addColorStop(1,shadeHex(hex,.12))}
 else if(type==='tulip'){g.addColorStop(0,shadeHex(hex,.7));g.addColorStop(.3,shadeHex(hex,.2));g.addColorStop(.7,hex);g.addColorStop(1,shadeHex(hex,-.12))}
 else if(type==='gerbera'){g.addColorStop(0,shadeHex(hex,-.3));g.addColorStop(.35,hex);g.addColorStop(1,shadeHex(hex,.18))}
 else if(type==='daisy'){g.addColorStop(0,'#eadf8a');g.addColorStop(.25,shadeHex(hex,-.02));g.addColorStop(1,shadeHex(hex,-.05))}
 else {g.addColorStop(0,hex);g.addColorStop(1,hex)}
 x.fillStyle=g;x.fillRect(0,0,W,H);
 y.fillStyle='#808080';y.fillRect(0,0,W,H);
 // edge falloff
 const hg=x.createLinearGradient(0,0,W,0);const ed=type==='rose'?.26:.14;
 hg.addColorStop(0,`rgba(0,0,0,${ed})`);hg.addColorStop(.2,'rgba(0,0,0,0)');hg.addColorStop(.8,'rgba(0,0,0,0)');hg.addColorStop(1,`rgba(0,0,0,${ed})`);x.fillStyle=hg;x.fillRect(0,0,W,H);
 // veins
 const nv=type==='gerbera'||type==='daisy'?10:type==='rose'?11:8;
 for(let k=0;k<nv;k++){const u=(k+.5)/nv*W;const cx=W/2+(u-W/2)*.12,ex=W/2+(u-W/2)*(type==='gerbera'||type==='daisy'?.75:1.05);
  x.strokeStyle=`rgba(0,0,0,${type==='rose'?.035:.03})`;x.lineWidth=1.1;x.beginPath();x.moveTo(cx,H);x.quadraticCurveTo(u,H*.45,ex,H*.06);x.stroke();
  y.strokeStyle='rgba(60,60,60,.28)';y.lineWidth=2.4;y.beginPath();y.moveTo(cx,H);y.quadraticCurveTo(u,H*.45,ex,H*.06);y.stroke()}
 if(type==='lily'){ // رگه‌ی میانی و خال‌ها
  x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=3;x.beginPath();x.moveTo(W/2,H);x.lineTo(W/2,H*.12);x.stroke();
  for(let i=0;i<46;i++){const px=W/2+(r()-.5)*W*.5*(1-0),py=H*(.45+r()*.5);const rr=1.4+r()*2.6;x.fillStyle=`rgba(${60+r()*40|0},20,40,${.35+r()*.35})`;x.beginPath();x.ellipse(px,py,rr,rr*1.2,r()*3,0,7);x.fill()}
  const sg=x.createLinearGradient(0,H,0,H*.45);sg.addColorStop(0,'rgba(90,40,70,.28)');sg.addColorStop(1,'rgba(90,40,70,0)');x.fillStyle=sg;x.fillRect(W*.3,H*.45,W*.4,H*.55)}
 if(type==='tulip'){for(let i=0;i<9;i++){const px=r()*W;const lg=x.createLinearGradient(0,H,0,0);lg.addColorStop(0,'rgba(255,255,255,0)');lg.addColorStop(.5,`rgba(255,255,255,${.06+r()*.1})`);lg.addColorStop(1,'rgba(255,255,255,0)');x.strokeStyle=lg;x.lineWidth=2+r()*4;x.beginPath();x.moveTo(px,H);x.quadraticCurveTo(px+(r()-.5)*30,H*.5,W/2+(px-W/2)*.8,0);x.stroke()}}
 for(let i=0;i<500;i++){const v=r();x.fillStyle=v>.5?`rgba(255,255,255,${r()*.05})`:`rgba(0,0,0,${r()*.04})`;x.fillRect(r()*W,r()*H,1.2,2.4);y.fillStyle=`rgba(${v>.5?255:0},${v>.5?255:0},${v>.5?255:0},${r()*.12})`;y.fillRect(r()*W,r()*H,1.2,2.4)}
 const o={map:tex(c),bump:tex(b,false)};texCache[key]=o;return o;
}
function leafTex(hex){
 const key='leaf'+hex;if(texCache[key])return texCache[key];
 const W=128,H=256,c=mkC(W,H),x=c.getContext('2d');
 const g=x.createLinearGradient(0,H,0,0);g.addColorStop(0,shadeHex(hex,.08));g.addColorStop(1,shadeHex(hex,-.12));x.fillStyle=g;x.fillRect(0,0,W,H);
 x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=2;x.beginPath();x.moveTo(W/2,H);x.lineTo(W/2,0);x.stroke();
 x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=1;for(let i=1;i<9;i++){const yy=H-i*H/9;x.beginPath();x.moveTo(W/2,yy);x.lineTo(0,yy-H*.12);x.moveTo(W/2,yy);x.lineTo(W,yy-H*.12);x.stroke()}
 const o=tex(c);texCache[key]=o;return o;
}
function paperTex(kind,hex){
 const key='paper'+kind+hex;if(texCache[key])return texCache[key];
 const S=256,c=mkC(S,S),x=c.getContext('2d');x.fillStyle=hex;x.fillRect(0,0,S,S);
 const r=Math.random,n=kind==='kraft'?900:300;
 for(let i=0;i<n;i++){const l=r()*14+3,px=r()*S,py=r()*S,a=r()*6.28;x.strokeStyle=r()>.5?`rgba(255,255,255,${.04+r()*.07})`:`rgba(60,35,10,${.04+r()*.08})`;x.lineWidth=.6+r()*.8;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke()}
 const o=tex(c,true,[2,2]);texCache[key]=o;return o;
}
function ropeTex(){
 if(texCache.rope)return texCache.rope;
 const c=mkC(64,128),x=c.getContext('2d');x.fillStyle='#b99a68';x.fillRect(0,0,64,128);
 for(let i=-8;i<24;i++){x.strokeStyle=i%2?'#8a6d40':'#d3b883';x.lineWidth=5;x.beginPath();x.moveTo(-10,i*8);x.lineTo(74,i*8+40);x.stroke()}
 for(let i=0;i<500;i++){x.fillStyle=`rgba(${Math.random()>.5?255:40},${Math.random()>.5?240:30},180,${Math.random()*.15})`;x.fillRect(Math.random()*64,Math.random()*128,1,3)}
 const t=tex(c,true,[1,12]);texCache.rope=t;return t;
}

/* ---------- هندسه‌ی گلبرگ و برگ ---------- */
const geoCache={};
function surf(o){
 const su=o.su||8,sv=o.sv||12,pos=[],uv=[],idx=[];
 for(let j=0;j<=sv;j++){const v=j/sv,w=o.wid*o.prof(v);
  for(let i=0;i<=su;i++){const u=i/su*2-1,x=u*w/2;
   let yy=o.len*v-(o.cup||0)*x*x*.35;
   let z=-(o.cup||0)*x*x-(o.bend||0)*v*v*o.len*.5+(o.reflex||0)*Math.pow(Math.max(0,v-.5),2)*o.len*2;
   if(o.ruffle)z+=o.ruffle*Math.sin(v*16+u*4)*Math.pow(Math.abs(u),2)*v*o.len;
   if(o.twist)z+=o.twist*x*v;
   pos.push(x,yy,z);uv.push(i/su,v)}}
 for(let j=0;j<sv;j++)for(let i=0;i<su;i++){const a=j*(su+1)+i,b=a+1,c=a+su+1,d=c+1;idx.push(a,c,b,b,c,d)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
function getSurf(key,o){return geoCache[key]||(geoCache[key]=surf(o))}
const profRose=v=>Math.pow(Math.max(0,Math.sin(PI*Math.pow(v,.72))),.5)*.98+.03;
const profLily=v=>Math.pow(Math.max(0,Math.sin(PI*Math.pow(v,.8))),.85)*(1-.25*v)*Math.pow(1-v*.2,1)+.015;
const profTulip=v=>Math.pow(Math.max(0,Math.sin(PI*Math.pow(v,.9))),.6)+.03;
const profStrap=v=>{const t=Math.min(1,v/.14),e=Math.sqrt(Math.max(0,1-Math.pow(Math.max(0,(v-.84)/.16),2.4)));return(.35+.65*t)*e+.01};
const profLeaf=v=>Math.pow(Math.max(0,Math.sin(PI*Math.pow(v,.75))),.8)*(1-.2*v)+.01;
const profRound=v=>Math.sqrt(Math.max(0,Math.sin(PI*v)))*1.0+.01;
const profLance=v=>Math.pow(Math.max(0,Math.sin(PI*Math.pow(v,.65))),.9)+.01;

const M4=new T.Matrix4(),Q=new T.Quaternion(),E_=new T.Euler(),V3=new T.Vector3(),S3=new T.Vector3();
function mat(px,py,pz,rx,ry,rz,sx,sy,sz){E_.set(rx,ry,rz,'YXZ');Q.setFromEuler(E_);V3.set(px,py,pz);S3.set(sx||1,sy||1,sz||1);return new T.Matrix4().compose(V3,Q,S3)}
function merge(list){
 if(!list.length)return null;
 let np=0,ni=0;const gs=list.map(({g,m})=>{const c=g.clone();c.applyMatrix4(m);np+=c.attributes.position.count;ni+=c.index.count;return c});
 const P=new Float32Array(np*3),N=new Float32Array(np*3),U=new Float32Array(np*2),I=new Uint32Array(ni);let po=0,io=0;
 gs.forEach(g=>{const n=g.attributes.position.count;P.set(g.attributes.position.array,po*3);N.set(g.attributes.normal.array,po*3);if(g.attributes.uv)U.set(g.attributes.uv.array,po*2);const ix=g.index.array;for(let i=0;i<ix.length;i++)I[io+i]=ix[i]+po;po+=n;io+=ix.length;g.dispose()});
 const o=new T.BufferGeometry();o.setAttribute('position',new T.BufferAttribute(P,3));o.setAttribute('normal',new T.BufferAttribute(N,3));o.setAttribute('uv',new T.BufferAttribute(U,2));o.setIndex(new T.BufferAttribute(I,1));return o;
}
function tube(pts,r,seg=10,rad=6){const c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(p[0],p[1],p[2])));return new T.TubeGeometry(c,seg,r,rad,false)}
const sphereG=(r,ws=8,hs=6)=>new T.SphereGeometry(r,ws,hs);

/* ---------- مواد ---------- */
const matCache={};
function petalMat(type,hex){
 const key=type+hex;if(matCache[key])return matCache[key];
 const t=petalTex(type,hex);
 const m=new T.MeshPhysicalMaterial({map:t.map,bumpMap:t.bump,bumpScale:type==='rose'?.35:.25,roughness:type==='tulip'?.42:type==='lily'?.5:.58,metalness:0,clearcoat:type==='tulip'||type==='lily'?.25:.08,clearcoatRoughness:.5,side:T.DoubleSide,envMapIntensity:.7});
 m.emissive=new T.Color(hex).multiplyScalar(type==='daisy'?.05:.14);m.emissiveIntensity=.55;
 matCache[key]=m;return m;
}
const solid=(c,rough=.7,o={})=>{const k='s'+c+rough+JSON.stringify(o);return matCache[k]||(matCache[k]=new T.MeshStandardMaterial(Object.assign({color:c,roughness:rough,metalness:0,side:T.DoubleSide},o)))};
function leafMat(hex){const k='lf'+hex;return matCache[k]||(matCache[k]=new T.MeshStandardMaterial({map:leafTex(hex).map||leafTex(hex),color:0xffffff,roughness:.55,side:T.DoubleSide,envMapIntensity:.6}))}
const STEM=()=>solid('#3f6b2f',.6);

/* ---------- ساخت گل‌ها (واحد: شعاع سر ≈ ۱) ---------- */
const flCache={};
function buildFlower(type,open,variant){
 const key=type+open.toFixed(1)+variant;if(flCache[key])return flCache[key];
 const R=rngf(variant*97+type.charCodeAt(0)+Math.round(open*10)),pet=[],grn=[],oth=[],dark=[],yel=[];
 const addP=(geo,m)=>pet.push({g:geo,m});
 const j=a=>(R()-.5)*a;
 if(type==='rose'){
  const LY=[[3,.02,5,.55,.5,1.9,.55,0],[4,.05,10,.78,.72,1.5,.38,0],[5,.1,22,.92,.92,1.2,.18,0],[6,.16,36,1,1.05,1,.05,0],[7,.22,52,1.05,1.15,.8,0,.15],[8,.28,68,1.05,1.22,.6,0,.32]];
  const nL=open<.3?4:open<.8?5:6,ts=open<.3?.5:open<.8?.82:1;
  LY.slice(0,nL).forEach((l,i)=>{const[n,rho,th,len,wid,cup,bend,rf]=l;const geo=getSurf('rose'+i,{len,wid,cup,bend,reflex:rf,prof:profRose,su:8,sv:12,ruffle:i>=3?.04:0});
   for(let k=0;k<n;k++){const phi=k*2*PI/n+i*1.9+j(.3),tilt=th*ts*PI/180+j(.1);addP(geo,mat(rho*Math.sin(phi),-i*.03,rho*Math.cos(phi),tilt,phi,0,1+j(.1),1+j(.08),1))}});
  const sg=getSurf('sepal',{len:.8,wid:.22,cup:.3,bend:0,prof:profLance,su:2,sv:6});
  for(let k=0;k<5;k++){const phi=k*2*PI/5+j(.2);grn.push({g:sg,m:mat(0,-.08,0,2.0+j(.3),phi,0,1,1,1)})}
  grn.push({g:sphereG(.22,8,6),m:mat(0,-.2,0,0,0,0,1,.9,1)});
 }
 else if(type==='lily'){
  const th=(25+open*45)*PI/180;
  for(let k=0;k<6;k++){const inner=k%2===1,phi=k*PI/3+j(.1);
   const geo=getSurf('lily'+(inner?'i':'o'),{len:1.15,wid:inner?1.0:.78,cup:inner?.9:.7,bend:0,reflex:inner?.9:.8,prof:profLily,su:8,sv:14,ruffle:inner?.05:.015});
   addP(geo,mat(0,0,0,th+(inner?.08:0)+j(.1),phi,0,1,1+j(.05),1))}
  for(let k=0;k<6;k++){const phi=k*PI/3+.3,ex=Math.sin(phi)*.3,ez=Math.cos(phi)*.3;
   oth.push({g:tube([[0,0,0],[ex*.4,.45,ez*.4],[ex,.85,ez]],.022,6,4),m:mat(0,0,0,0,0,0)});
   dark.push({g:sphereG(.075,8,6),m:mat(ex,.88,ez,0,0,0,1,1.8,1)})}
  oth.push({g:tube([[0,0,0],[.02,.5,.04],[.05,.95,.12]],.03,6,4),m:mat(0,0,0,0,0,0)});
  yel.push({g:sphereG(.06,8,6),m:mat(.05,.97,.12,0,0,0,1,1.2,1)});
  grn.push({g:sphereG(.14,8,6),m:mat(0,-.05,0,0,0,0,1,.9,1)});
 }
 else if(type==='tulip'){
  const rho=.38;
  for(let k=0;k<6;k++){const inner=k%2===1,phi=k*PI/3+j(.05);
   const geo=getSurf('tulip'+(inner?'i':'o'),{len:inner?1.2:1.3,wid:inner?.9:.95,cup:inner?1.7:1.5,bend:inner?.12:.05,reflex:open*.35,prof:profTulip,su:8,sv:12});
   const tilt=(inner?2:7)*PI/180+open*(inner?.16:.26)+j(.03);
   addP(geo,mat(rho*Math.sin(phi)*(inner?.85:1),0,rho*Math.cos(phi)*(inner?.85:1),tilt,phi,0,1,1+j(.04),1))}
  for(let k=0;k<6;k++){const phi=k*PI/3;dark.push({g:tube([[0,0,0],[Math.sin(phi)*.1,.4,Math.cos(phi)*.1]],.025,4,4),m:mat(0,0,0,0,0,0)});yel.push({g:sphereG(.05,6,4),m:mat(Math.sin(phi)*.1,.42,Math.cos(phi)*.1,0,0,0,1,1.5,1)})}
  grn.push({g:sphereG(.2,8,6),m:mat(0,-.02,0,0,0,0,1,.9,1)});
 }
 else if(type==='gerbera'||type==='daisy'){
  const ger=type==='gerbera';
  const rows=ger?[[18,1.05,.2,0,.1],[18,.92,.19,.5,.06],[14,.74,.18,.25,.02]]:[[17,.95,.22,0,.1],[17,.82,.2,.5,.06]];
  const tl=ger?[78,66,50]:[80,68];const ts=open<.3?.4:open<.8?.78:1;
  rows.forEach((rw,ri)=>{const[n,len,wid,off,dy]=rw;const geo=getSurf(type+ri,{len,wid:wid*2.0,cup:ger?.9:.7,bend:-.15,reflex:0,prof:profStrap,su:5,sv:10});
   for(let k=0;k<n;k++){const phi=(k+off)*2*PI/n+j(.05),tilt=tl[ri]*ts*PI/180+j(.1);addP(geo,mat(.2*Math.sin(phi),dy+ri*.03,.2*Math.cos(phi),tilt,phi,0,1+j(.1),1+j(.1),1))}});
  const dr=ger?.24:.3;
  oth.push({g:new T.SphereGeometry(dr,16,8,0,PI*2,0,PI/2),m:mat(0,.06,0,0,0,0,1,ger?.45:.65,1)});
  grn.push({g:sphereG(.2,8,6),m:mat(0,-.05,0,0,0,0,1,.7,1)});
  const sg=getSurf('sepalg',{len:.5,wid:.18,cup:.2,prof:profLance,su:2,sv:5});for(let k=0;k<8;k++)grn.push({g:sg,m:mat(0,-.04,0,2.2,k*PI/4,0)});
 }
 else if(type==='baby'){
  for(let b=0;b<9;b++){const a=b*2.4+j(.3),el=.35+R()*.6,len=.7+R()*.45,dx=Math.sin(a)*Math.sin(el)*len,dz=Math.cos(a)*Math.sin(el)*len,dy=Math.cos(el)*len;
   grn.push({g:tube([[0,0,0],[dx*.5,dy*.5,dz*.5],[dx,dy,dz]],.012,4,3),m:mat(0,0,0,0,0,0)});
   for(let s=0;s<3;s++){const t2=.45+s*.25,bx=dx*t2,by=dy*t2,bz=dz*t2,a2=a+(s-1)*.9,ex=bx+Math.sin(a2)*.28,ey=by+.2,ez=bz+Math.cos(a2)*.28;
    grn.push({g:tube([[bx,by,bz],[(bx+ex)/2,(by+ey)/2+.04,(bz+ez)/2],[ex,ey,ez]],.008,3,3),m:mat(0,0,0,0,0,0)});
    addP(sphereG(.06+R()*.025,7,5),mat(ex,ey,ez,0,0,0));yel.push({g:sphereG(.02,4,3),m:mat(ex,ey+.04,ez,0,0,0)})}
   addP(sphereG(.07,7,5),mat(dx,dy,dz,0,0,0))}
 }
 const out={pet:merge(pet),grn:merge(grn),oth:merge(oth),dark:merge(dark),yel:merge(yel)};
 flCache[key]=out;return out;
}
function flowerGroup(type,hex,open,variant){
 const b=buildFlower(type,open,variant),g=new T.Group();
 const add=(geo,m,cast=true)=>{if(!geo)return;const me=new T.Mesh(geo,m);me.castShadow=cast;me.receiveShadow=true;g.add(me)};
 const pm=type==='baby'?solid('#fbfbf8',.8,{emissive:'#ffffff',emissiveIntensity:.18}):petalMat(type,hex);
 add(b.pet,pm);
 add(b.grn,type==='baby'?solid('#7d9a61',.8):solid('#3f6b2f',.6));
 if(type==='lily'){add(b.oth,solid('#cfd9a3',.6));add(b.dark,solid('#6b3513',.5));add(b.yel,solid('#c9d870',.5))}
 else if(type==='tulip'){add(b.dark,solid('#2d2a2a',.6));add(b.yel,solid('#3a2d3d',.6))}
 else if(type==='gerbera'){add(b.oth,new T.MeshStandardMaterial({color:'#3a2213',roughness:.8,map:discTex('#3a2213','#e9b83b')}))}
 else if(type==='daisy'){add(b.oth,new T.MeshStandardMaterial({color:'#f2c218',roughness:.85,map:discTex('#e8a90a','#fbe27a')}))}
 else if(type==='baby'){add(b.yel,solid('#e8d98a',.7))}
 return g;
}
function discTex(a,b){const k='disc'+a+b;if(texCache[k])return texCache[k];const c=mkC(128,128),x=c.getContext('2d');x.fillStyle=a;x.fillRect(0,0,128,128);for(let i=0;i<420;i++){const ang=i*2.39996,r=Math.sqrt(i)*3;x.fillStyle=i%7?b:a;x.globalAlpha=.55;x.beginPath();x.arc(64+Math.cos(ang)*r,64+Math.sin(ang)*r,1.5,0,7);x.fill()}const t=tex(c);texCache[k]=t;return t}

/* ---------- سبزینه ---------- */
function greenGroup(kind,variant){
 const R=rngf(variant*31+7),leaves=[],stem=[];const euc=kind==='euc';
 const hexL=euc?'#86ab9c':'#2f6a3e';
 const lg=euc?getSurf('eucl',{len:1,wid:.95,cup:.9,prof:profRound,su:6,sv:8}):getSurf('rusl',{len:1,wid:.55,cup:.5,prof:profLance,su:4,sv:8});
 const n=euc?11:9,len=euc?5.5:5.5;
 const pts=[[0,0,0],[.4,len*.35,.2],[.2,len*.7,-.3],[.1,len,.1]];
 stem.push({g:tube(pts,.06,14,4),m:mat(0,0,0,0,0,0)});
 for(let i=0;i<n;i++){const t=(i+1)/(n+1),py=len*t,side=i%2?1:-1,sc=(euc?1.5:1.7)*(1-.45*t)*(.9+R()*.2),ang=side*(.9+R()*.3);
  leaves.push({g:lg,m:mat(Math.sin(t*3)*.35,py,Math.cos(t*2)*.1,-.9-R()*.3,ang+PI/2*(1-side)/2*0+(side>0?0:PI),0,sc,sc,sc)})}
 leaves.push({g:lg,m:mat(.1,len,.1,-.3,0,0,.9,.9,.9)});
 const g=new T.Group();
 const a=new T.Mesh(merge(leaves),euc?leafMat('#86ab9c'):leafMat('#2f6a3e'));a.castShadow=true;a.receiveShadow=true;g.add(a);
 const b=new T.Mesh(merge(stem),solid('#6b8a58',.7));g.add(b);return g;
}
function roseLeaf(){const g=getSurf('rleaf',{len:2.6,wid:1.5,cup:.25,bend:.2,prof:profLeaf,su:6,sv:10,ruffle:.02});const m=new T.Mesh(g,leafMat('#3f7a3f'));m.castShadow=true;return m}

window.__F3parts={rngf,shadeHex,mkC,tex,petalTex,leafTex,paperTex,ropeTex,surf,getSurf,mat,merge,tube,sphereG,solid,leafMat,petalMat,flowerGroup,greenGroup,roseLeaf,profLance,profLeaf,profRound,STEM,discTex,geoCache,matCache,texCache};
})();
