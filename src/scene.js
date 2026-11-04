/* ============ سازنده‌ی صحنه: دسته‌گل، باکس، روبان، نخ کنفی، کارت ============ */
(function(){
const T=THREE,F=window.__F3parts,PI=Math.PI,GOLD=137.508*PI/180;
const FD=window.FD; // داده‌های گل (از برنامه)
const HS={rose:1,lily:1.05,tulip:1,gerbera:1.05,daisy:.9,baby:1.1};
const REFF={rose:1.15,lily:1.6,tulip:.95,gerbera:1.3,daisy:.8,baby:.7};
const FILL={daisy:1,baby:1};
const V=(x,y,z)=>new T.Vector3(x,y,z);
const hash=(a,b)=>{const x=Math.sin(a*12.9898+b*78.233)*43758.5453;return x-Math.floor(x)};

/* ---------- مدل‌ها ---------- */
const BQ={
 wrap:{th:60,top:5.4,paper:'cone',elong:1,back:2.3,rimLift:-.5},
 hand:{th:54,top:5.2,paper:null,elong:1},
 posy:{th:78,top:3.7,paper:'cone',elong:1,back:.9,rimLift:-.2,short:true},
 arm:{th:56,top:6.2,paper:'cone',elong:1.5,back:2.8,rimLift:-.5}
};
const BX={round:{},square:{},heart:{},rect:{}};
const SIZE_BOX={round:{S:2.6,M:3.2,L:4},square:{S:5.2,M:6.4,L:8},heart:{S:2.8,M:3.5,L:4.4},rect:{S:[7,4.4],M:[8.8,5.4],L:[11,6.6]}};

/* ---------- ابزار هندسه ---------- */
function stripGeo(pts,width,closed,segs,side){
 const curve=new T.CatmullRomCurve3(pts,closed,'catmullrom',.5),pos=[],uv=[],idx=[];
 for(let i=0;i<=segs;i++){const t=i/segs,p=curve.getPoint(closed?t%1:t);
  pos.push(p.x-side.x*width/2,p.y-side.y*width/2,p.z-side.z*width/2,p.x+side.x*width/2,p.y+side.y*width/2,p.z+side.z*width/2);uv.push(0,t*6,1,t*6)}
 for(let i=0;i<segs;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
let weaveT=null;
function weave(){if(weaveT)return weaveT;const c=F.mkC(64,64),x=c.getContext('2d');x.fillStyle='#808080';x.fillRect(0,0,64,64);for(let i=0;i<64;i+=2){x.fillStyle='rgba(255,255,255,.35)';x.fillRect(0,i,64,1)}for(let i=0;i<64;i+=4){x.fillStyle='rgba(0,0,0,.2)';x.fillRect(i,0,1,64)}weaveT=new T.CanvasTexture(c);weaveT.wrapS=weaveT.wrapT=T.RepeatWrapping;weaveT.repeat.set(2,24);return weaveT}
function ribbonMat(hex,style){
 const k='rb'+hex+style;if(F.matCache[k])return F.matCache[k];
 let m;
 if(style==='organza')m=new T.MeshPhysicalMaterial({color:hex,roughness:.35,transparent:true,opacity:.62,side:T.DoubleSide,clearcoat:.3,depthWrite:false});
 else if(style==='grosgrain')m=new T.MeshStandardMaterial({color:hex,roughness:.78,bumpMap:weave(),bumpScale:.5,side:T.DoubleSide});
 else m=new T.MeshPhysicalMaterial({color:hex,roughness:.28,clearcoat:.55,clearcoatRoughness:.25,side:T.DoubleSide,bumpMap:weave(),bumpScale:.15,envMapIntensity:.55});
 F.matCache[k]=m;return m;
}
function bow(w,s,hex,style,sc){
 const g=new T.Group(),mt=ribbonMat(hex,style),Z=V(0,0,1);
 const loopPts=[V(0,0,0),V(.55,.6,.05),V(1.5,.85,.12),V(2.2,.25,.1),V(1.6,-.5,.12),V(.6,-.4,.06)].map(p=>p.multiplyScalar(s));
 [1,-1].forEach(sd=>{
  const lp=loopPts.map(p=>V(p.x*sd,p.y,p.z));
  const m=new T.Mesh(stripGeo(lp,w,true,60,Z),mt);m.rotation.y=sd*.18;m.rotation.x=.06*sd;m.castShadow=true;g.add(m);
  const inner=[V(0,0,0),V(.5,.3,.14),V(1.0,.38,.2),V(1.35,.08,.17),V(1.0,-.25,.17),V(.45,-.2,.1)].map(p=>V(p.x*s*sd,p.y*s,p.z*s));
  const m2=new T.Mesh(stripGeo(inner,w*.95,true,40,Z),mt);m2.rotation.y=sd*.12;m2.castShadow=true;g.add(m2);
  const tl=[V(0,0,0),V(.35*sd*s,-1.1*s,.14),V(.15*sd*s,-2.3*s,.2),V(.6*sd*s,-3.4*s,.16)];
  const t=new T.Mesh(stripGeo(tl,w,false,28,Z),mt);t.rotation.z=sd*.12;t.castShadow=true;g.add(t);
 });
 const k=new T.Mesh(new T.SphereGeometry(w*.62,16,12),mt);k.scale.set(1.1,1.15,.8);k.position.z=.06;g.add(k);
 return g;
}
function bandLathe(r,y,h,hex,style){
 const pts=[];for(let i=0;i<=1;i++)pts.push(new T.Vector2(r,i*h));
 const m=new T.Mesh(new T.CylinderGeometry(r,r,h,64,1,true),ribbonMat(hex,style));m.position.y=y;return m;
}
function twineHelix(rAt,y0,y1,turns,R){
 const pts=[];const N=Math.round(turns*20);
 for(let k=0;k<=N;k++){const t=k/N,a=t*turns*2*PI,y=y0+(y1-y0)*t,r=rAt(y)+.05;pts.push(V(r*Math.sin(a),y,r*Math.cos(a)))}
 const c=new T.CatmullRomCurve3(pts);
 const m=new T.Mesh(new T.TubeGeometry(c,N*2,.055,6,false),new T.MeshStandardMaterial({color:'#b59a68',roughness:1,map:F.ropeTex(),bumpMap:F.ropeTex(),bumpScale:.8}));
 m.castShadow=true;return m;
}
function twineBow(front,y,s){
 const g=new T.Group(),mat=new T.MeshStandardMaterial({color:'#b59a68',roughness:1,map:F.ropeTex(),bumpMap:F.ropeTex(),bumpScale:.8});
 [1,-1].forEach(sd=>{
  const lp=[V(0,0,0),V(.4*sd,.35,.08),V(.95*sd,.4,.12),V(1.25*sd,.05,.1),V(.9*sd,-.28,.1),V(.4*sd,-.15,.05)].map(p=>p.multiplyScalar(s));
  g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(lp,true),40,.05,5,true),mat));
  const tl=[V(0,0,0),V(.2*sd*s,-.8*s,.1),V(.5*sd*s,-1.6*s,.12),V(.4*sd*s,-2.3*s,.1)];
  g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(tl),20,.05,5,false),mat));
 });
 const k=new T.Mesh(new T.SphereGeometry(.14,10,8),mat);g.add(k);g.position.set(0,y,front);return g;
}
function polyShape(poly,holes){const sh=new T.Shape(poly.map(p=>new T.Vector2(p[0],p[1])));(holes||[]).forEach(h=>sh.holes.push(new T.Path(h.map(p=>new T.Vector2(p[0],p[1])))));return sh}
function outline(kind,size){
 const pts=[];const N=kind==='heart'?160:kind==='round'?96:0;
 if(kind==='round'){const R=SIZE_BOX.round[size];for(let i=0;i<N;i++){const a=i/N*2*PI;pts.push([R*Math.cos(a),R*Math.sin(a)])}}
 else if(kind==='heart'){const R=SIZE_BOX.heart[size]/17;for(let i=0;i<N;i++){const t=i/N*2*PI;pts.push([R*16*Math.pow(Math.sin(t),3),R*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))])}}
 else{const d=kind==='square'?[SIZE_BOX.square[size],SIZE_BOX.square[size]]:SIZE_BOX.rect[size],rr=Math.min(d[0],d[1])*.12,hx=d[0]/2,hy=d[1]/2;
  [[hx-rr,hy-rr,0],[-hx+rr,hy-rr,PI/2],[-hx+rr,-hy+rr,PI],[hx-rr,-hy+rr,3*PI/2]].forEach(c=>{for(let i=0;i<=8;i++){const a=c[2]+i/8*PI/2;pts.push([c[0]+rr*Math.cos(a),c[1]+rr*Math.sin(a)])}})}
 return pts;
}
function scalePoly(p,k){return p.map(q=>[q[0]*k,q[1]*k])}
function inPoly(x,y,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
function polyArea(p){let a=0;for(let i=0,j=p.length-1;i<p.length;j=i++)a+=(p[j][0]+p[i][0])*(p[j][1]-p[i][1]);return Math.abs(a/2)}

/* ---------- گل‌ها: چیدمان ---------- */
function slotsFor(cfg,R){
 const L=[];ORD().forEach(k=>{const it=cfg.items[k];if(it&&it[0]>0)for(let i=0;i<it[0];i++)L.push({t:k,c:FD.FL[k].cols[it[1]][1]})});
 const foc=L.filter(f=>!FILL[f.t]),fil=L.filter(f=>FILL[f.t]),n=L.length;
 const sh=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]}};
 sh(foc);sh(fil);
 const slot=Array(n).fill(null),idx=[];for(let i=Math.floor(n*.3);i<n;i++)idx.push(i);sh(idx);
 fil.forEach((f,i)=>{slot[idx[i%idx.length]]=f});
 let fi=0;for(let i=0;i<n;i++)if(!slot[i])slot[i]=foc[fi++]||fil.pop();
 return slot;
}
const ORD=()=>FD.ORDER;
function placeFlower(grp,pos,normal,roll,scale,type,hex,open,variant){
 const f=F.flowerGroup(type,hex,open,variant);
 const q=new T.Quaternion().setFromUnitVectors(V(0,1,0),normal.clone().normalize());
 const r=new T.Quaternion().setFromAxisAngle(V(0,1,0),roll);
 f.quaternion.copy(q).multiply(r);f.position.copy(pos);f.userData.s=scale;f.scale.setScalar(scale);
 grp.add(f);return f;
}

/* ---------- دسته‌گل ---------- */
function buildBouquet(cfg){
 const root=new T.Group(),M=BQ[cfg.model]||BQ.wrap,R=F.rngf((cfg.seed||7)*13+5),info={flowers:[]};
 const slots=slotsFor(cfg,R),n=slots.length,open=FD.BLOOM[cfg.bloom][1];
 const stemCm=cfg.stem||50,Htot=stemCm/3,top=M.top,Hs=Math.max(3.2,(Htot-top)*(M.paper?(M.short?.6:.56):.85));
 const th=M.th*PI/180,elong=M.elong;
 let sr=0;slots.forEach(s=>sr+=Math.pow(REFF[s.t]*HS[s.t],2));
 const Rd=Math.max(3.2,Math.sqrt(sr*1.1/(2*(1-Math.cos(th)))));
 const C=V(0,top-Rd,0),Bp=V(0,0,0);
 const stems=[],leaves=[],heads=[];
 const leafG=n?F.roseLeaf().geometry:null;
 let maxRim=0,minRimY=99,xmax=0;
 slots.forEach((s,i)=>{
  const u=(i+.5)/n,t=th*Math.sqrt(u),ph=i*GOLD+(R()-.5)*.3;
  const d=V(Math.sin(t)*Math.sin(ph),Math.cos(t),Math.sin(t)*Math.cos(ph));
  const P=C.clone().add(d.clone().multiplyScalar(Rd));P.x*=elong;P.x+=(R()-.5)*.25;P.z+=(R()-.5)*.25;P.y+=(R()-.5)*.2;
  const nrm=V((P.x-C.x)/(elong*elong),P.y-C.y,P.z-C.z).normalize();
  const sc=HS[s.t]*(.94+R()*.12);
  const fl=placeFlower(root,P,nrm,R()*6.28,sc,s.t,s.c,open,i%4);fl.userData.key=s.t+s.c+i;heads.push(fl);
  const rim=Math.hypot(P.x,P.z);if(t>th*.8){maxRim=Math.max(maxRim,rim);minRimY=Math.min(minRimY,P.y)}xmax=Math.max(xmax,Math.abs(P.x));
  const base=P.clone().sub(nrm.clone().multiplyScalar(.25*sc));
  const dh=V(base.x,0,base.z).length();
  const dirOut=V(base.x,0,base.z).normalize();
  const end=V(-dirOut.x*(.25+R()*.45)+(R()-.5)*.4,-Hs,-dirOut.z*(.25+R()*.45)+(R()-.5)*.4);
  const pts=[base,base.clone().lerp(Bp,.55).add(V((R()-.5)*.2,0,(R()-.5)*.2)),V(0,0,0).add(V(dirOut.x*.12,0,dirOut.z*.12)),V(-dirOut.x*.25,-Hs*.35,-dirOut.z*.25),end];
  const crv=new T.CatmullRomCurve3(pts,false,'centripetal');
  stems.push({g:new T.TubeGeometry(crv,26,.1+.02*(s.t==='lily'),5,false),m:new T.Matrix4()});
  if(s.t==='rose'&&i%2===0&&leafG){const pp=crv.getPoint(.42),dir=V(dirOut.x*.8,.7,dirOut.z*.8).normalize();const q=new T.Quaternion().setFromUnitVectors(V(0,1,0),dir);leaves.push({g:leafG,m:new T.Matrix4().compose(pp,q.multiply(new T.Quaternion().setFromAxisAngle(V(0,1,0),R()*6)),V(.55,.55,.55))})}
 });
 info.heads=heads;info.top=top;info.Rd=Rd;info.rimR=maxRim+.4;info.rimY=minRimY;
 const stemMesh=new T.Mesh(F.merge(stems),new T.MeshStandardMaterial({color:'#3f6b2f',roughness:.65}));stemMesh.castShadow=true;stemMesh.receiveShadow=true;root.add(stemMesh);
 if(leaves.length){const lm=new T.Mesh(F.merge(leaves),F.leafMat('#3f7a3f'));lm.castShadow=true;root.add(lm)}
 // سبزینه
 if(cfg.green&&cfg.green.n>0){
  const ng=cfg.green.n,Rg=F.rngf(55);
  for(let i=0;i<ng;i++){
   const g=F.greenGroup(cfg.green.k,i+3),a=i/ng*2*PI+Rg()*.5,tilt=(th*180/PI+14+Rg()*10)*PI/180;
   const dir=V(Math.sin(tilt)*Math.sin(a),Math.cos(tilt),Math.sin(tilt)*Math.cos(a));
   const q=new T.Quaternion().setFromUnitVectors(V(0,1,0),dir);g.quaternion.copy(q);g.position.set(0,-.3,0);
   const len=Math.hypot(Rd*Math.sin(th)*elong,top-Rd*(1-Math.cos(th)))*1.08;g.scale.setScalar(len/5.5);
   g.userData.key='g'+i;root.add(g);heads.push(g);g.userData.s=len/5.5;
  }
 }
 // کاغذ
 const yR=M.short?-.9:-1.2,rB=M.paper?1.45:.95;
 let rAt=y=>rB;
 if(M.paper){
  const yb=-Hs+.7,yt=minRimY+(M.rimLift||0)-.2;
  const o={yb,yB:yR,yt,ytRef:yt,r0:.85,rB,rt:maxRim+.9,elong,back:M.back};
  const cg=coneGeo(o,0),ci=coneGeo(o,-.07);
  const pc=FD.PAPERS[cfg.paper.c][1],style=cfg.paper.style;
  const pm=new T.MeshStandardMaterial({color:pc,roughness:style==='tissue'?.55:.92,map:F.paperTex(style==='kraft'?'kraft':'p',pc),side:T.DoubleSide,transparent:style==='tissue',opacity:style==='tissue'?.9:1,metalness:0});
  const pi=new T.MeshStandardMaterial({color:F.shadeHex(pc,.55),roughness:.9,side:T.DoubleSide});
  const a=new T.Mesh(cg,pm),b=new T.Mesh(ci,pi);[a,b].forEach(m=>{m.castShadow=true;m.receiveShadow=true;root.add(m)});
  rAt=y=>{if(y<yR){const k=Math.max(0,(y-yb)/(yR-yb));return o.r0+(o.rB-o.r0)*Math.pow(k,.9)}const k=Math.min(1,(y-yR)/(yt-yR));return o.rB+(o.rt-o.rB)*Math.pow(k,1.45)};
 }
 // روبان و نخ
 const front=rAt(yR)*1;
 const rb=cfg.ribbon;const wMap={S:.38,M:.85,L:1.5},w=wMap[rb.w]||.85;
 info.ribbonY=yR;info.front=front+.15;
 if(rb.on){
  const rc=F.shadeHex(FD.RIBS[rb.c][1],-.12);
  const band=bandLathe(front+.04,yR,w,rc,rb.style);band.castShadow=true;root.add(band);
  const bw=bow(w*(rb.w==='L'?.9:1),rb.w==='L'?.9:.85+cfg.size.length*0+({S:0,M:.12,L:.28})[cfg.size],rc,rb.style);
  bw.position.set(0,yR,front+.1);root.add(bw);info.bow=bw;
 }
 if(cfg.jute){
  const jy0=yR-(rb.on?w*.2:.4),jy1=yR+(rb.on?w*.5:.4);
  root.add(twineHelix(y=>rAt(y)+(rb.on?.08:.02),jy0,jy1,rb.on?5:4,0));
  const tb=twineBow(front+(rb.on?.2:.1),yR+(rb.on?w*.55:.35),.9);tb.rotation.z=rb.on?.35:0;tb.position.x=rb.on?-.9:0;root.add(tb);
 }
 // کارت
 info.cardAnchor=V(rb.on?2.1:1.4,yR-(rb.on?2.6:1.4),front+.55);
 if(cfg.card&&cfg.card.on){const co=cardObject(cfg,V(info.cardAnchor.x,info.cardAnchor.y+.1,info.cardAnchor.z),rb.on?V(.3,yR-.1,front+.35):V(.4,yR,front+.2));root.add(co);if(co.userData.string)root.add(co.userData.string)}
 // افزودنی
 if(cfg.extras.includes('choc'))root.add(chocBox(V(Math.max(maxRim,3)+2.6,-Hs+1.4,2.2)));
 info.height=top+Hs;info.Hs=Hs;
 return {group:root,info};
}
function coneGeo(o,inset){
 const su=96,sv=30,pos=[],uv=[],idx=[];
 for(let j=0;j<=sv;j++){const s=j/sv;
  for(let i=0;i<=su;i++){const ph=i/su*2*PI,front=(1-Math.cos(ph))/2;
   const ytop=o.yt+(o.back||0)*front+.2*Math.sin(ph*5+1)+.1*Math.sin(ph*11)-(front<.12?.5*(1-front/.12):0);
   const y=o.yb+(ytop-o.yb)*s;
   let r;if(y<o.yB){const k=Math.max(0,(y-o.yb)/(o.yB-o.yb));r=o.r0+(o.rB-o.r0)*Math.pow(k,.9)}else{const k=Math.min(1.3,(y-o.yB)/(o.ytRef-o.yB));r=o.rB+(o.rt-o.rB)*Math.pow(k,1.45)}
   const pl=1+(.035+.045*Math.min(1,s*1.4))*Math.sin(ph*7+s*1.9)*Math.min(1,Math.max(0,(y-o.yB+1)/2.5))+.018*Math.sin(ph*19+s*3);
   r=(r*pl)+(inset||0);
   pos.push(r*Math.sin(ph)*o.elong,y,r*Math.cos(ph));uv.push(i/su*3,s*2)}}
 for(let j=0;j<sv;j++)for(let i=0;i<su;i++){const a=j*(su+1)+i,b=a+1,c=a+su+1,d=c+1;idx.push(a,b,c,b,d,c)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
function chocBox(p){
 const g=new T.Group();
 const b=new T.Mesh(new T.BoxGeometry(3.2,.9,3.2),new T.MeshStandardMaterial({color:'#3a1f16',roughness:.5}));b.castShadow=true;g.add(b);
 for(let i=0;i<9;i++){const m=new T.Mesh(new T.SphereGeometry(.38,16,12),new T.MeshStandardMaterial({color:i%3?'#c9982f':'#5a2c19',roughness:.28,metalness:i%3?.8:0}));m.position.set(-.9+(i%3)*.9,.62,-.9+Math.floor(i/3)*.9);m.castShadow=true;g.add(m)}
 g.position.copy(p);g.rotation.y=-.4;return g;
}

/* ---------- باکس ---------- */
function buildBox(cfg){
 const root=new T.Group(),R=F.rngf((cfg.seed||7)*13+9),info={};
 const open=FD.BLOOM[cfg.bloom][1],slots=slotsFor(cfg,R),n=slots.length;
 const poly=outline(cfg.model,cfg.size),area=polyArea(poly);
 const h=2.8,wall=.28,col=FD.BOXCOL[cfg.boxCol][1];
 const bodyMat=new T.MeshStandardMaterial({color:col,roughness:.82,map:F.paperTex('p',col),bumpMap:F.paperTex('p',col),bumpScale:.4,side:T.DoubleSide});
 const inMat=new T.MeshStandardMaterial({color:F.shadeHex(col,-.15),roughness:.9,side:T.DoubleSide});
 const ex=(sh,depth,bevel)=>new T.ExtrudeGeometry(sh,{depth,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:3,curveSegments:24});
 const inner=scalePoly(poly,cfg.model==='heart'?.92:.93);
 // دیواره
 const wallG=ex(polyShape(poly,[inner.slice().reverse()]),h-.12,.06);wallG.rotateX(-PI/2);
 const wall_=new T.Mesh(wallG,bodyMat);wall_.castShadow=true;wall_.receiveShadow=true;root.add(wall_);
 const baseG=ex(polyShape(poly),.2,.06);baseG.rotateX(-PI/2);const base=new T.Mesh(baseG,bodyMat);base.castShadow=true;root.add(base);
 // فوم
 const foamTop=h-.55;
 const fG=new T.ExtrudeGeometry(polyShape(scalePoly(poly,.92)),{depth:foamTop-.2,bevelEnabled:false});fG.rotateX(-PI/2);
 const foam=new T.Mesh(fG,new T.MeshStandardMaterial({color:'#0f1a10',roughness:1}));foam.position.y=.2;root.add(foam);
 // لبه‌ی طلایی
 // گل‌ها
 const ip=scalePoly(poly,.86);
 const sp=Math.sqrt(area*.82/Math.max(n,1));
 const pts=[];const cf=sp*.62;
 for(let i=0;i<n*14&&pts.length<n;i++){const r=cf*Math.sqrt(i+.5),a=i*GOLD,x=r*Math.cos(a),z=r*Math.sin(a);if(inPoly(x,z,ip))pts.push([x,z])}
 while(pts.length<n)pts.push([0,0]);
 let rmax=0;pts.forEach(p=>rmax=Math.max(rmax,Math.hypot(p[0],p[1])));rmax=Math.max(rmax,1);
 const sf=Math.max(.5,Math.min(1.35,Math.sqrt(area*1.0/(slots.reduce((a,s)=>a+Math.pow(REFF[s.t]*HS[s.t],2),0)*PI*1.05))));
 const domeH=Math.min(2.4,rmax*.34),heads=[];
 const sorted=pts.map((p,i)=>({p,i,r:Math.hypot(p[0],p[1])})).sort((a,b)=>a.r-b.r);
 const stems=[];
 sorted.forEach((o,k)=>{
  const s=slots[k]||slots[0];if(!s)return;
  const x=o.p[0],z=o.p[1],rr=o.r/rmax,y=foamTop+.6+domeH*(1-rr*rr)+(R()-.5)*.15;
  const gx=-2*domeH*x/(rmax*rmax),gz=-2*domeH*z/(rmax*rmax),nrm=V(-gx,1,-gz).normalize();
  const sc=HS[s.t]*sf*(.95+R()*.1);
  const P=V(x,y,z);const fl=placeFlower(root,P,nrm,R()*6.28,sc,s.t,s.c,open,k%4);fl.userData.key=s.t+s.c+k;heads.push(fl);
  stems.push({g:new T.CylinderGeometry(.08,.08,y-foamTop+.3,5),m:new T.Matrix4().makeTranslation(x,(y+foamTop-.3)/2,z)});
 });
 if(stems.length){const sm=new T.Mesh(F.merge(stems),new T.MeshStandardMaterial({color:'#3f6b2f',roughness:.65}));root.add(sm)}
 // سبزینه دور باکس
 if(cfg.green&&cfg.green.n>0){
  const ng=cfg.green.n,gp=poly;
  for(let i=0;i<ng;i++){
   const a=i/ng*2*PI+.4,pt=gp[Math.floor(((a/(2*PI))%1)*gp.length)],len=3.8;
   const g=F.greenGroup(cfg.green.k,i+3),dir=V(pt[0],.9,pt[1]).normalize();
   g.quaternion.setFromUnitVectors(V(0,1,0),dir);g.position.set(pt[0]*.7,foamTop+.3,pt[1]*.7);g.scale.setScalar(len/5.5);g.userData.key='g'+i;g.userData.s=len/5.5;root.add(g);heads.push(g);
  }
 }
 info.heads=heads;info.top=foamTop+domeH+1.2;
 // روبان
 const rb=cfg.ribbon,wMap={S:.38,M:.85,L:1.5},w=wMap[rb.w]||.85;
 const front=Math.max(...poly.map(p=>p[1]))*(cfg.model==='heart'?-1:1);
 let fz=0;const zs=poly.map(p=>p[1]);fz=Math.max(...zs); // جلو = +z، پس z محور شکل بعد از چرخش: y→-z
 const midY=h*.52;
 // بعد از rotateX(-PI/2): y شکل -> -z دنیا. پس نقطه‌ی جلو (z دنیا بیشینه) = minimum y شکل
 const frontZ=-Math.min(...poly.map(p=>p[1]));
 info.ribbonY=midY;info.front=frontZ;
 if(rb.on){
  const rc=F.shadeHex(FD.RIBS[rb.c][1],-.12);
  const bg=ex(polyShape(scalePoly(poly,1.012),[scalePoly(poly,.985).reverse()]),w,.01);bg.rotateX(-PI/2);
  const bm=new T.Mesh(bg,ribbonMat(rc,rb.style));bm.position.y=midY-w/2;bm.castShadow=true;root.add(bm);
  const bw=bow(w*(rb.w==='L'?.9:1),.78+({S:0,M:.1,L:.24})[cfg.size],rc,rb.style);
  bw.position.set(0,midY,frontZ+.15);bw.rotation.x=0;root.add(bw);info.bow=bw;
 }
 if(cfg.jute){
  const tw=twineBow(frontZ+(rb.on?.35:.12),midY+(rb.on?w*.55:0),.85);tw.position.x=rb.on?-.8:0;root.add(tw);
 }
 // کارت روی چوب
 if(cfg.card&&cfg.card.on){
  const stick=new T.Mesh(new T.CylinderGeometry(.05,.05,5.4,6),new T.MeshStandardMaterial({color:'#caa86a',roughness:.8}));
  const sx=ip.length?ip[Math.floor(ip.length*.12)][0]*.78:2,sz=-(ip.length?ip[Math.floor(ip.length*.12)][1]:0)*.5;
  stick.position.set(sx,foamTop+2.2,sz+1.2);stick.rotation.z=-.22;stick.rotation.x=.12;root.add(stick);
  const cp=V(sx+.5,foamTop+4.6,sz+1.6);root.add(cardObject(cfg,cp,null,true));
  info.cardAnchor=cp.clone();
 } else info.cardAnchor=V(0,midY,frontZ+1);
 if(cfg.extras.includes('choc'))root.add(chocBox(V(SIZE_BOX.round.L+(cfg.model==='rect'?SIZE_BOX.rect[cfg.size][0]/2-4:0)+.8,.6,1.2)));
 info.height=h+domeH;info.box=true;info.rmax=rmax;
 return {group:root,info};
}

/* ---------- کارت تبریک ---------- */
function drawCard(card,W=768,H=512){
 const c=F.mkC(W,H),x=c.getContext('2d'),m=card.m,txt=(card.text||'').trim();
 const bg={kraft:'#c9a572',water:'#fbf7f0',rose:'#5e1129',noir:'#15111a',photo:'#fbfaf7'}[m];
 x.fillStyle=bg;x.fillRect(0,0,W,H);
 const R=F.rngf(5);let ink='#3a2a1a',acc='#8a6a3c';
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
 // متن
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
function cardObject(cfg,pos,knot,onStick){
 const g=new T.Group(),card=cfg.card,cv=drawCard(card),tx=F.tex(cv);
 const w=3.5,h=2.4;
 const edge=new T.MeshStandardMaterial({color:'#f4efe6',roughness:.9}),back=new T.MeshStandardMaterial({color:card.m==='noir'?'#15111a':card.m==='rose'?'#5e1129':'#f4efe6',roughness:.9});
 const front=new T.MeshStandardMaterial({map:tx,roughness:.75,metalness:0});
 const mesh=new T.Mesh(new T.BoxGeometry(w,h,.06),[edge,edge,edge,edge,front,back]);mesh.castShadow=true;g.add(mesh);
 g.position.copy(pos);g.rotation.z=onStick?-.1:-.12;g.rotation.x=onStick?-.05:-.06;g.userData.card=true;
 if(knot){
  const hole=pos.clone().add(V(-w*.42*.0,h/2-.15,.02)),s=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([knot,V((knot.x+hole.x)/2,(knot.y+hole.y)/2-.3,(knot.z+hole.z)/2+.12),hole]),20,.03,4,false),new T.MeshStandardMaterial({color:'#b59a68',roughness:1}));
  s.userData.str=true;g.userData.string=s;
 }
 return g;
}
window.SC={buildBouquet,buildBox,drawCard,BQ,SIZE_BOX,hash,REFF};
})();
