/* ============ گل‌های سه‌بعدی ساخته‌شده از عکس واقعی ============
   هر گل از عکس واقعی خودش روی یک سطح برجسته یا چند صفحه‌ی متقاطع ساخته می‌شه، پس از هر زاویه دیده می‌شه. */
(function(){
const T=THREE,F=window.__F3parts,FL=window.FD.FL,PI=Math.PI;
const texC={},matC={};
function tex(name){
 if(texC[name])return texC[name];const im=PH.IMG[name];if(!im)return null;
 const t=new T.Texture(im);t.encoding=T.sRGBEncoding;t.anisotropy=4;t.generateMipmaps=true;t.minFilter=T.LinearMipmapLinearFilter;t.needsUpdate=true;return texC[name]=t;
}
function mat(name,emi){
 const k=name+emi;if(matC[k])return matC[k];const t=tex(name);
 const m=new T.MeshLambertMaterial({map:t,alphaTest:.45,side:T.DoubleSide,emissive:'#ffffff',emissiveMap:t,emissiveIntensity:emi});
 m.userData.depth=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,map:t,alphaTest:.45,side:T.DoubleSide});
 return matC[k]=m;
}
const mesh=(geo,m)=>{const me=new T.Mesh(geo,m);me.castShadow=true;me.receiveShadow=true;me.customDepthMaterial=m.userData.depth;return me};
const solidM=(c,r)=>new T.MeshStandardMaterial({color:c,roughness:r||.7});
const colIdx=(type,hex)=>{const i=FL[type].cols.findIndex(c=>c[1]===hex);return i<0?0:i};
const spriteOf=(type,hex)=>FL[type].cols[colIdx(type,hex)][3];

/* سطح برجسته (گنبد، کاسه یا تخت) که عکس روش افتاده */
const geoC={};
function surface(sprite,o){
 const k=sprite+JSON.stringify(o);if(geoC[k])return geoC[k];
 const im=PH.IMG[sprite],crop=o.crop||1,asp=im.height*crop/im.width,W=o.W,Hd=W*asp,N=28;
 const pos=[],uv=[],ind=[];
 for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){
  const u=i/N,v=j/N,x=(u-o.cu)*W,z=(v-o.cv)*Hd,d=Math.hypot(x,z)/(o.rh*W);let y;
  if(o.mode==='cup'){y=d<1?o.H*(d*d*.95-.35):o.H*.6-(d-1)*W*.12}
  else if(o.mode==='flat'){y=d<1?o.H*Math.pow(1-d*d,.6):-(d-1)*W*.1}
  else{y=d<1?o.H*Math.pow(1-d*d,.55):-(d-1)*W*.28}
  pos.push(x,y,z);uv.push(u,1-v*crop);
 }
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=j*(N+1)+i,b=a+1,c=a+N+1,d=c+1;ind.push(a,c,b,b,c,d)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ind);g.computeVertexNormals();
 return geoC[k]=g;
}
function planeGeo(w,h,y0,crop,k){
 const key='pl'+w.toFixed(2)+h.toFixed(2)+y0+crop+k;if(geoC[key])return geoC[key];
 const g=new T.PlaneGeometry(w,h);g.translate(0,y0+h/2,0);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setY(i,1-(1-uv.getY(i))*crop);
 return geoC[key]=g;
}
function crossed(sprite,w,h,y0,crop,n,emi,flip){
 const g=new T.Group(),m=mat(sprite,emi);
 for(let i=0;i<n;i++){const me=mesh(planeGeo(w,h,y0,crop,i),m);me.rotation.y=i*PI/n+(flip?.4:0);g.add(me)}
 return g;
}
const sepalGeo=new T.ConeGeometry(.55,.9,10,1,true);sepalGeo.translate(0,-.45,0);
const stubGeo=new T.CylinderGeometry(.07,.09,.9,8);stubGeo.translate(0,-.9,0);

function flowerGroup(type,hex,open,variant){
 const sp=spriteOf(type,hex),g=new T.Group(),im=PH.IMG[sp];
 if(!im)return g;
 const o=.88+.2*(open||0),flip=(variant||0)%2===1;
 if(type==='rose'){
  const me=mesh(surface(sp,{W:2.1,cu:.5,cv:.44,rh:.47,H:.9*(.75+.35*(open||0)),mode:'dome'}),mat(sp,.5));if(flip)me.scale.x=-1;g.add(me);
  const s=new T.Mesh(sepalGeo,solidM('#4c7a38'));s.position.y=.05;s.scale.setScalar(.95);s.castShadow=true;g.add(s);
 }else if(type==='carn'){
  const me=mesh(surface(sp,{W:2.0,cu:.5,cv:.4,rh:.5,H:.75*(.8+.3*(open||0)),crop:.52,mode:'dome'}),mat(sp,.5));if(flip)me.scale.x=-1;g.add(me);
  const s=new T.Mesh(sepalGeo,solidM('#5b8a47'));s.position.y=.05;s.castShadow=true;g.add(s);
 }else if(type==='gerbera'){
  const me=mesh(surface(sp,{W:2.35,cu:.5,cv:.5,rh:.49,H:.45*(.7+.5*(open||0)),mode:'flat'}),mat(sp,.5));if(flip)me.scale.x=-1;g.add(me);
  const s=new T.Mesh(sepalGeo,solidM('#5f8c46'));s.position.y=.02;s.scale.setScalar(.8);g.add(s);
 }else if(type==='lily'){
  const me=mesh(surface(sp,{W:2.7,cu:.5,cv:.5,rh:.48,H:.8*(.6+.6*(open||0)),mode:'cup'}),mat(sp,.5));if(flip)me.scale.x=-1;g.add(me);
  const s=new T.Mesh(sepalGeo,solidM('#7a9a5c'));s.position.y=-.1;s.scale.setScalar(.8);g.add(s);
 }else if(type==='tulip'){
  const cr=.62,w=1.9,h=w*im.height*cr/im.width;
  g.add(crossed(sp,w,h,-.45,cr,3,.5,flip));
 }else if(type==='baby'){
  const w=2.1,h=w*im.height/im.width;
  g.add(crossed(sp,w,h,-.05,1,3,.62,flip));
 }
 g.scale.setScalar(1);
 return g;
}
function greenGroup(kind,variant){
 const euc=kind==='euc',sp=euc?(variant%2?'euc':'euc2'):(variant%2?'rus':'fern'),im=PH.IMG[sp],g=new T.Group();
 if(!im)return g;const w=euc?2.1:1.9,h=Math.min(6.4,w*im.height/im.width*1.15);
 g.add(crossed(sp,w,h,0,1,3,.5,variant%2===0));
 const st=new T.Mesh(new T.CylinderGeometry(.04,.06,h*.45,6),solidM('#6b8a58'));st.position.y=h*.22;g.add(st);
 g.scale.setScalar(6.4/h);
 return g;
}
/* کاغذ: رنگ + بافت ابریشمی واقعی */
const paperC={};
function paperTex(kind,hex){
 const k=kind+hex;if(paperC[k])return paperC[k];
 const c=F.mkC(256,256),x=c.getContext('2d');x.fillStyle=hex;x.fillRect(0,0,256,256);
 const im=PH.IMG.paper;if(im){x.globalCompositeOperation='soft-light';x.globalAlpha=kind==='kraft'?.8:.95;x.drawImage(im,0,0,256,256);x.globalAlpha=1;x.globalCompositeOperation='source-over'}
 const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(1.2,1.2);t.anisotropy=4;return paperC[k]=t;
}
F.flowerGroup=flowerGroup;F.greenGroup=greenGroup;F.paperTex=paperTex;
})();
