/* ============ نمایشگر سه‌بعدی (چرخش با کشیدن، حرکت نرم دوربین) ============ */
(function(){
const T=THREE,F=window.__F3parts,PI=Math.PI;
const V=(x,y,z)=>new T.Vector3(x,y,z);
const ease=k=>1-Math.pow(1-k,3);const REDUCE_=matchMedia('(prefers-reduced-motion: reduce)').matches;
class Viewer{
 constructor(el,opt={}){
  this.el=el;this.opt=opt;this.vis=true;this.dirty=true;this.t0=performance.now();
  const r=this.r=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:!!opt.keep});
  const small=Math.min(screen.width||999,innerWidth)<700;this.small=small;this.pr=Math.min(window.devicePixelRatio||1,opt.thumb?1:(small?1.5:2));r.setPixelRatio(this.pr);if(small&&opt.motes)opt.motes=Math.round(opt.motes*.5);
  r.outputEncoding=T.sRGBEncoding;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=.82;
  r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;
  r.domElement.style.cssText='width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab';
  el.appendChild(r.domElement);
  const s=this.scene=new T.Scene();
  const hm=this.hemi=new T.HemisphereLight('#fff4ec','#a89aad',.42);s.add(hm);
  const k=this.key=new T.DirectionalLight('#fff0dd',1.15);k.position.set(9,16,12);k.castShadow=true;k.shadow.mapSize.set(opt.thumb||small?1024:2048,opt.thumb||small?1024:2048);
  Object.assign(k.shadow.camera,{left:-20,right:20,top:22,bottom:-22,near:1,far:60});k.shadow.bias=-.0004;k.shadow.normalBias=.04;s.add(k);
  const f=this.fill=new T.DirectionalLight('#dfe6ff',.38);f.position.set(-12,6,8);s.add(f);
  const b=this.back=new T.DirectionalLight('#ffe3ee',.5);b.position.set(-4,10,-14);s.add(b);
  // محیط نرم برای بازتاب‌ها
  try{const pm=new T.PMREMGenerator(r),es=new T.Scene();
   es.background=new T.Color('#8f8794');
   const bx=(c,i,p,sc)=>{const m=new T.Mesh(new T.PlaneGeometry(sc[0],sc[1]),new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(i),side:T.DoubleSide}));m.position.set(...p);m.lookAt(0,0,0);es.add(m)};
   bx('#ffffff',2.2,[6,8,6],[8,8]);bx('#ffe8d0',1.4,[-8,3,4],[6,10]);bx('#cfe0ff',1,[0,-2,9],[12,5]);bx('#ffffff',1.2,[0,10,-6],[10,6]);
   s.environment=pm.fromScene(es,.04).texture;pm.dispose();}catch(e){}
  this.cam=new T.PerspectiveCamera(opt.fov||27,1,.1,300);
  this.rig={yaw:opt.yaw??.18,pitch:opt.pitch??.3,dist:40,tx:0,ty:0,tz:0,tYaw:null,tPitch:null,tDist:40,tTx:0,tTy:0,tTz:0};
  this.world=new T.Group();s.add(this.world);
  const g=this.ground=new T.Mesh(new T.PlaneGeometry(80,80),new T.ShadowMaterial({opacity:.13}));g.rotation.x=-PI/2;g.receiveShadow=true;s.add(g);
  this.idle=opt.auto?1:0;this.lastInput=0;this.cur=null;this.known=new Set();
  this.fx=[];this.mouse={x:0,y:0,sx:0,sy:0};this.spin=null;this.light=null;this.lightName='studio';
  if(!opt.thumb)this._extras();
  this._bind();this._resize();
  if(!opt.thumb){this.ro=new ResizeObserver(()=>this._resize());this.ro.observe(el);
   this.io=new IntersectionObserver(es=>{this.vis=es[0].isIntersecting;if(this.vis){this.dirty=true;this._tick()}},{threshold:0});this.io.observe(el);
   this._loop=this._loop.bind(this);this.raf=requestAnimationFrame(this._loop)}
 }
 _extras(){
  const T_=T;
  // سکوی نمایش
  const pm=new T_.MeshStandardMaterial({color:'#f6ede7',roughness:.55,metalness:.05});
  const ped=this.ped=new T_.Group();
  const disk=new T_.Mesh(new T_.CylinderGeometry(1,1,.3,72),pm);disk.receiveShadow=true;disk.castShadow=false;disk.position.y=-.15;ped.add(disk);
  const ringM=this.ringM=new T_.MeshBasicMaterial({color:'#e8789a',transparent:true,opacity:.9});
  const ring=new T_.Mesh(new T_.TorusGeometry(1,.035,8,96),ringM);ring.rotation.x=Math.PI/2;ring.position.y=-.02;ped.add(ring);
  this.scene.add(ped);
  // ذرات گرد و غبار نورانی
  const N=this.opt.motes||70,pos=new Float32Array(N*3);this.moteSeed=[];
  for(let i=0;i<N;i++){this.moteSeed.push([Math.random()*6.28,Math.random(),Math.random()*6.28,.15+Math.random()*.35]);}
  const g=new T_.BufferGeometry();g.setAttribute('position',new T_.BufferAttribute(pos,3));
  const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');const gr=x.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.4,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,32,32);
  this.motes=new T_.Points(g,new T_.PointsMaterial({map:new T_.CanvasTexture(c),size:.34,transparent:true,opacity:.55,depthWrite:false,blending:T_.AdditiveBlending,color:'#fff0e6'}));
  this.motes.frustumCulled=false;this.scene.add(this.motes);
  this.petalTex=(()=>{const cc=document.createElement('canvas');cc.width=cc.height=48;const q=cc.getContext('2d');q.translate(24,24);q.beginPath();q.moveTo(0,-20);q.bezierCurveTo(16,-14,16,12,0,20);q.bezierCurveTo(-16,12,-16,-14,0,-20);q.fillStyle='#fff';q.fill();return new T_.CanvasTexture(cc)})();
 }
 _layoutExtras(b){
  if(!this.ped)return;const sz=b.getSize(V(0,0,0)),ct=b.getCenter(V(0,0,0));
  const R=Math.max(sz.x,sz.z)*.4+.5;this.ped.position.set(ct.x,b.min.y,ct.z);this.ped.children.forEach(m=>{m.scale.set(R,m.geometry.type==='CylinderGeometry'?1:1,R)});
  this.ped.children[0].scale.y=1;this.ped.children[1].scale.set(R,R,1);this.ped.children[1].scale.z=1;
  this.ground.position.y=b.min.y-.3;this.R=R;this.top=b.max.y;
 }
 setAccent(hex){if(this.ringM)this.ringM.color.set(hex)}
 setLight(name){
  const P={
   studio:{hemi:['#fff4ec','#a89aad',.42],key:['#fff0dd',1.15],fill:['#dfe6ff',.38],back:['#ffe3ee',.5],exp:.82},
   golden:{hemi:['#ffd9b0','#8a6a7a',.46],key:['#ffb36b',1.35],fill:['#ff9a8a',.3],back:['#ffd2a8',.7],exp:.88},
   morning:{hemi:['#e6f2ff','#b9c4d8',.62],key:['#fffaf0',1.25],fill:['#cfe3ff',.5],back:['#ffffff',.45],exp:.86},
   night:{hemi:['#6a6fd8','#201a3a',.3],key:['#a9b8ff',.8],fill:['#7a55d8',.35],back:['#ff7fb0',1.1],exp:.78}
  };const p=P[name];if(!p)return;this.lightName=name;
  this.light={hemi:[new T.Color(p.hemi[0]),new T.Color(p.hemi[1]),p.hemi[2]],key:[new T.Color(p.key[0]),p.key[1]],fill:[new T.Color(p.fill[0]),p.fill[1]],back:[new T.Color(p.back[0]),p.back[1]],exp:p.exp};this.dirty=true;
  this.motes&&(this.motes.material.opacity=name==='night'?.9:.5);
 }
 _stepLight(k){
  const L=this.light;if(!L)return false;let ch=false;
  const m=(c,t)=>{const d=Math.abs(c.r-t.r)+Math.abs(c.g-t.g)+Math.abs(c.b-t.b);if(d>.003){c.lerp(t,k);ch=true}};
  const n=(o,key,t)=>{if(Math.abs(o[key]-t)>.002){o[key]+=(t-o[key])*k;ch=true}};
  m(this.hemi.color,L.hemi[0]);m(this.hemi.groundColor,L.hemi[1]);n(this.hemi,'intensity',L.hemi[2]);
  m(this.key.color,L.key[0]);n(this.key,'intensity',L.key[1]);m(this.fill.color,L.fill[0]);n(this.fill,'intensity',L.fill[1]);
  m(this.back.color,L.back[0]);n(this.back,'intensity',L.back[1]);
  const r=this.r;if(Math.abs(r.toneMappingExposure-L.exp)>.002){r.toneMappingExposure+=(L.exp-r.toneMappingExposure)*k;ch=true}
  return ch;
 }
 burst(hex,n,at){
  if(this.opt.thumb||!this.cur)return;n=n||26;
  const pos=new Float32Array(n*3),vel=[];const o=at||V(0,(this.top||6)*.78,0);
  for(let i=0;i<n;i++){const a=Math.random()*6.28,u=Math.random(),sp=1.4+Math.random()*2.6;pos[i*3]=o.x;pos[i*3+1]=o.y;pos[i*3+2]=o.z;vel.push([Math.cos(a)*sp*(.4+u),1.2+Math.random()*2.6,Math.sin(a)*sp*(.4+u)]);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));
  const m=new T.PointsMaterial({map:this.petalTex,size:.55,transparent:true,opacity:1,depthWrite:false,color:hex||'#ffb7cf',alphaTest:.02});
  const pts=new T.Points(g,m);pts.frustumCulled=false;this.scene.add(pts);this.fx.push({pts,vel,t0:performance.now(),dur:1500});this.dirty=true;
 }
 finale(){ // یک چرخش سینمایی کامل
  if(this.opt.thumb||REDUCE_)return;this.spin={t0:performance.now(),from:this.rig.yaw,dur:3200};this.rig.tYaw=null;this.lastInput=performance.now()+3200;
 }
 _bind(){
  const c=this.r.domElement;let drag=null;
  c.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw:this.rig.yaw,pitch:this.rig.pitch,id:e.pointerId,moved:false};c.setPointerCapture(e.pointerId);c.style.cursor='grabbing';this.lastInput=performance.now()});
  c.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;this.rig.yaw=drag.yaw-dx*.008;this.rig.pitch=Math.max(-.12,Math.min(1.45,drag.pitch+dy*.006));this.rig.tYaw=null;this.rig.tPitch=null;this.dirty=true;this.lastInput=performance.now()});
  const up=()=>{drag=null;c.style.cursor='grab'};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
  c.addEventListener('dblclick',()=>{this.userZoom=1;this.focus('all')});
  c.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();this.zoomBy(e.deltaY<0?1.08:.93)}},{passive:false});
  if(this.opt.parallax){const mv=e=>{const r=this.el.getBoundingClientRect();this.mouse.x=((e.clientX-r.left)/r.width-.5)*2;this.mouse.y=((e.clientY-r.top)/r.height-.5)*2};
   addEventListener('pointermove',mv,{passive:true});}
 }
 _resize(){const w=this.el.clientWidth||300,h=this.el.clientHeight||300;this.r.setSize(w,h,false);this.cam.aspect=w/h;this.cam.updateProjectionMatrix();this.dirty=true;if(this.cur)this._fit(true)}
 setConfig(cfg){
  const old=this.cur&&this.cur.group;
  if(old){this.world.remove(old)}
  const built=cfg.kind==='box'?SC.buildBox(cfg):SC.buildBouquet(cfg);
  built.group.traverse(o=>{if(o.material){[].concat(o.material).forEach(m=>{if(m.envMapIntensity!==undefined&&m.envMapIntensity>.5)m.envMapIntensity=.5})}});this.cur=built;this.cfg=cfg;this.world.add(built.group);
  // ظهور گل‌های تازه
  const now=performance.now(),firstLoad=!this.known.size;let rank=0;
  const keys=new Set();
  built.info.heads.forEach(h=>{const k=h.userData.key;keys.add(k);if(!this.known.has(k)){h.userData.born=now+(firstLoad&&this.opt.stagger?rank*70:rank*35);rank++;h.scale.setScalar(.001)}});
  this.known=keys;this.animating=true;
  // فیلتر نمایش: یک‌بار bbox
  this._measure();this._fit(false);this.dirty=true;this._tick();
 }
 _measure(){
  const g=this.cur.group;const hide=[];g.traverse(o=>{if(o.userData&&o.userData.card){hide.push(o)}});
  hide.forEach(o=>o.visible=false);
  this.bbox=new T.Box3().setFromObject(g);hide.forEach(o=>o.visible=true);
  const b=this.bbox;this.ground.position.y=b.min.y-.02;this._layoutExtras(b);
 }
 _fit(snap){
  const b=this.bbox;if(!b)return;const sz=b.getSize(V(0,0,0)),ct=b.getCenter(V(0,0,0)),i=this.cur.info;
  const fov=this.cam.fov*PI/180,asp=this.cam.aspect;
  const needH=sz.y*1.16,needW=Math.max(sz.x,sz.z)*(this.opt.thumb?1.12:1.08);
  const d=Math.max(needH/(2*Math.tan(fov/2)),needW/(2*Math.tan(fov/2)*asp))+Math.max(sz.z,sz.x)*.22;
  this.base={d,c:ct,sz,i};
  const f=this.opt.focusMode||'all';this.focus(this.focusName||f,snap);
 }
 focus(name,snap){
  if(!this.base)return;this.focusName=name;const{d,c,sz,i}=this.base,r=this.rig;
  let t=c.clone(),dist=d,yaw=null,pitch=null;
  const heads=i.heads&&i.heads.length;
  if(name==='flowers'){const top=i.box?i.top-.8:i.top*.82;t=V(0,top+.9,0);dist=d*.78;pitch=.5}
  else if(name==='ribbon'){const y=i.ribbonY!=null?i.ribbonY:c.y;t=V(0,y+.4,i.front?i.front*.4:0);dist=d*.5;yaw=0;pitch=.18}
  else if(name==='card'){const a=i.cardAnchor||c;t=V(a.x*.7,a.y,a.z*.4);dist=d*.46;yaw=0;pitch=.12}
  else if(name==='pack'){t=V(c.x,c.y*.85,c.z);dist=d*.9;pitch=.35}
  else if(name==='top'){dist=d*.8;pitch=.9}
  r.tTx=t.x;r.tTy=t.y;r.tTz=t.z;r.tDist=dist*(this.userZoom||1);r.tYaw=yaw;r.tPitch=pitch;
  if(snap){r.tx=t.x;r.ty=t.y;r.tz=t.z;r.dist=dist;if(yaw!=null)r.yaw=yaw;if(pitch!=null)r.pitch=pitch}
  this.dirty=true;this._tick();
 }
 _tick(){if(!this.opt.thumb)return;}
 zoomBy(f){this.userZoom=Math.max(.5,Math.min(1.6,(this.userZoom||1)*f));this.focus(this.focusName||'all');}
 view(name){this.focus('all');const P={front:[0,.2],three:[.62,.32],side:[PI/2,.14],back:[PI,.22],top:[0,1.3]}[name];if(!P)return;const r=this.rig,tw=2*PI;let y=P[0];y+=tw*Math.round((r.yaw-y)/tw);r.tYaw=y;r.tPitch=P[1];this.idle=0;this.lastInput=performance.now();this.dirty=true;}
 _loop(now){
  this.raf=requestAnimationFrame(this._loop);
  if(!this.vis||document.hidden||!this.cur){this._lt=0;return}
  if(this._lt){const dt=now-this._lt;this._fa=(this._fa||16)*.95+dt*.05;this._fc=(this._fc||0)+1;
   if(this._fc>90&&this._fa>30&&this.pr>1){this.pr=Math.max(1,this.pr-.25);this.r.setPixelRatio(this.pr);this._resize();this._fc=0;this._fa=16}}
  this._lt=now;
  const r=this.rig;let ch=false,amb=false;
  const dt=Math.min(.1,(now-(this._lt||now))/1000);this._lt=now;const lerp=(a,b,k)=>a+(b-a)*k,k=1-Math.exp(-dt*7);
  ['Tx:tx','Ty:ty','Tz:tz','Dist:dist'].forEach(p=>{const[tk,ck]=p.split(':');const t=r['t'+tk],c=r[ck];if(Math.abs(t-c)>.002){r[ck]=lerp(c,t,k);ch=true}});
  if(r.tYaw!=null){const d=r.tYaw-r.yaw;if(Math.abs(d)>.002){r.yaw+=d*k;ch=true}}
  if(r.tPitch!=null){const d=r.tPitch-r.pitch;if(Math.abs(d)>.002){r.pitch+=d*k;ch=true}}
  if(this.idle&&now-this.lastInput>2200){r.yaw+=.0035;ch=true}
  if(this.spin){const q=(now-this.spin.t0)/this.spin.dur;if(q>=1){r.yaw=this.spin.from+Math.PI*2;this.spin=null}else{const e=q<.5?4*q*q*q:1-Math.pow(-2*q+2,3)/2;r.yaw=this.spin.from+e*Math.PI*2}ch=true}
  if(this._stepLight(1-Math.exp(-dt*4)))ch=true;
  if(this.ped){
   const tt=now/1000;
   if(this.opt.breathe&&!REDUCE_){this.world.rotation.z=Math.sin(tt*.9)*.011;this.world.rotation.x=Math.cos(tt*.7)*.007;amb=true}
   if(this.motes&&this.R){const a=this.motes.geometry.attributes.position.array,R=this.R,H=this.top||6;this.moteSeed.forEach((s,i)=>{const ang=s[0]+tt*s[3]*.4,rr=R*(.7+s[1]*1.9);a[i*3]=Math.cos(ang)*rr;a[i*3+1]=((s[1]*H*1.4+tt*s[3]*.8)%(H*1.4));a[i*3+2]=Math.sin(ang)*rr*.8});this.motes.geometry.attributes.position.needsUpdate=true;this.motes.position.y=this.ped.position.y;amb=true}
  }
  if(this.opt.parallax&&!REDUCE_){const m=this.mouse;m.sx+=(m.x-m.sx)*(1-Math.exp(-dt*3));m.sy+=(m.y-m.sy)*(1-Math.exp(-dt*3));if(Math.abs(m.x-m.sx)+Math.abs(m.y-m.sy)>.002)amb=true}
  if(this.fx.length){ch=true;this.fx=this.fx.filter(f=>{const q=(now-f.t0)/f.dur;if(q>=1){this.scene.remove(f.pts);f.pts.geometry.dispose();f.pts.material.dispose();return false}
    const a=f.pts.geometry.attributes.position.array,d=dt;for(let i=0;i<f.vel.length;i++){const v=f.vel[i];v[1]-=5.2*d;a[i*3]+=v[0]*d;a[i*3+1]+=v[1]*d;a[i*3+2]+=v[2]*d}f.pts.geometry.attributes.position.needsUpdate=true;f.pts.material.opacity=1-q*q;return true})}
  if(this.animating){let any=false;this.cur.info.heads.forEach(h=>{const b=h.userData.born;if(b==null)return;const k2=(now-b)/750;if(k2<1){any=true;const e=k2<=0?.001:Math.max(.001,this._back(k2));h.scale.setScalar(h.userData.s*e)}else{h.scale.setScalar(h.userData.s);h.userData.born=null}});this.animating=any;ch=true}
  if(amb&&!ch&&now-(this._lr||0)<48)return;
  if(ch||amb||this.dirty){this._render();this.dirty=false;this._lr=now}
 }
 _back(t){const c1=1.5,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)}
 _render(){
  const r=this.rig,c=this.cam;const yw=r.yaw+(this.opt.parallax&&!REDUCE_?this.mouse.sx*.16:0),pt=r.pitch+(this.opt.parallax&&!REDUCE_?-this.mouse.sy*.05:0);const cp=Math.cos(pt),sp=Math.sin(pt);
  c.position.set(r.tx+r.dist*cp*Math.sin(yw),r.ty+r.dist*sp,r.tz+r.dist*cp*Math.cos(yw));c.lookAt(r.tx,r.ty,r.tz);
  this.r.render(this.scene,c);
 }
 snapshot(size,bg){ // تصویر ثابت (برای سبد و کارت‌ها)
  const w=this.el.clientWidth,h=this.el.clientHeight;
  this.r.setSize(size,size,false);this.cam.aspect=1;this.cam.updateProjectionMatrix();
  this.animating=false;this.cur.info.heads.forEach(h=>{h.scale.setScalar(h.userData.s);h.userData.born=null});
  const sv={...this.rig};const mv=this.motes&&this.motes.visible;if(this.motes)this.motes.visible=false;const fxv=this.fx.map(f=>{f.pts.visible=false;return f});
  this.focus('all',true);this.spin=null;this._render();
  const out=document.createElement('canvas');out.width=out.height=size;const x=out.getContext('2d');
  if(bg){x.fillStyle=bg;x.fillRect(0,0,size,size)}
  x.drawImage(this.r.domElement,0,0,size,size);
  if(this.motes)this.motes.visible=mv;fxv.forEach(f=>f.pts.visible=true);Object.assign(this.rig,sv);this._resize();return out.toDataURL('image/jpeg',.86);
 }
 snapshotFree(cfg,size){ // برای thumbs: رندر آفلاین
  this.setConfig(cfg);
  this.cur.info.heads.forEach(h=>{h.scale.setScalar(h.userData.s);h.userData.born=null});this.animating=false;
  this.r.setSize(size,size,false);this.cam.aspect=1;this.cam.updateProjectionMatrix();this._measure();this._fit(true);this.rig.yaw=.35;this.rig.pitch=.28;
  this._render();return this.r.domElement.toDataURL('image/png');
 }
 icon(type,hex,open,size){
  const g=F.flowerGroup(type,hex,open,1);g.rotation.x=type==='tulip'?.35:.95;g.rotation.y=.4;
  const keep=this.world.children.slice();keep.forEach(o=>this.world.remove(o));this.world.add(g);this.ground.visible=false;
  const b=new T.Box3().setFromObject(g),ct=b.getCenter(V(0,0,0)),sz=b.getSize(V(0,0,0));
  this.r.setSize(size,size,false);this.cam.aspect=1;this.cam.updateProjectionMatrix();
  const d=Math.max(sz.x,sz.y,sz.z)*1.15/(2*Math.tan(this.cam.fov*PI/360))+sz.z*.5;
  this.cam.position.set(ct.x,ct.y+d*.18,ct.z+d);this.cam.lookAt(ct);this.r.render(this.scene,this.cam);
  const url=this.r.domElement.toDataURL('image/png');this.world.remove(g);keep.forEach(o=>this.world.add(o));this.ground.visible=true;return url;
 }
 dispose(){cancelAnimationFrame(this.raf);this.r.dispose()}
}
window.Viewer=Viewer;
})();
