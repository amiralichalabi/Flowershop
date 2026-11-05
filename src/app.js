/* ============ برنامه: شعبه‌ها، ویزارد مرحله‌ای، سبد ============ */
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const fa=n=>Number(n).toLocaleString('fa-IR');
const T$=n=>fa(Math.round(n))+' تومان';
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const FD=window.FD,F=window.__F3parts,{FL,ORDER,MAINS,BLOOM,PAPERS,RIBS,BOXCOL,MODELS,SIZES,CARDS,OCCASIONS,PRICES,EXTRAS}=FD;
const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
const shade=F.shadeHex;
const clone=c=>JSON.parse(JSON.stringify(c,(k,v)=>k==='photoImg'?undefined:v));
const MIN_F=5;

/* ---------- شعبه‌ها ---------- */
const BRANCHES=[
 {id:'elmosanat',name:'علموص فلاور',uni:'دانشگاه علم و صنعت',c:'#2f7de0',hours:'۹ تا ۱۹',spot:'مقابل ورودی اصلی',feat:['p1','b2','p5']},
 {id:'sharif',name:'شریف فلاور',uni:'دانشگاه صنعتی شریف',c:'#8a58e6',hours:'۹ تا ۲۰',spot:'مقابل سلف مرکزی',feat:['b1','p3','b4']},
 {id:'poly',name:'پلی فلاور',uni:'دانشگاه صنعتی امیرکبیر (پلی‌تکنیک)',c:'#e8792c',hours:'۹ تا ۱۹',spot:'کنار میدان اصلی',feat:['p2','b3','p6']},
 {id:'tehran',name:'تهران فلاور',uni:'دانشگاه تهران',c:'#17a574',hours:'۸:۳۰ تا ۱۹',spot:'نزدیک دروازه‌ی اصلی',feat:['p4','b5','p1']},
 {id:'beheshti',name:'بهشتی فلاور',uni:'دانشگاه شهید بهشتی',c:'#e03a72',hours:'۹ تا ۱۸',spot:'ابتدای محوطه‌ی مرکزی',feat:['b2','p5','b1']},
 {id:'soon',name:'شعبه‌های بعدی',uni:'به‌زودی ...',c:'#a08aa0',soon:true}
];
let branch=store.get('uf_branch','tehran');
const curBranch=()=>BRANCHES.find(b=>b.id===branch)||BRANCHES[3];

/* ---------- پیکربندی ---------- */
const def=(k,o)=>Object.assign({kind:k,model:k==='box'?'round':'wrap',size:'M',occasion:'none',mainT:'rose',items:{rose:[9,0],baby:[3,0]},green:{k:'euc',n:2},paper:{c:0,style:'kraft'},boxCol:0,ribbon:{on:true,c:1,style:'satin',w:'M'},jute:false,card:{on:true,m:'kraft',text:'',photo:null},bloom:'half',stem:50,extras:[],seed:7,note:''},o||{});
const PRESETS=[
 Object.assign(def('bouquet',{mainT:'rose',items:{rose:[12,0],baby:[3,0]},paper:{c:7,style:'matte'},ribbon:{on:true,c:1,style:'satin',w:'M'},bloom:'open',seed:3,card:{on:true,m:'rose',text:'دوستت دارم، امروز هم مثل همیشه.',photo:null}}),{id:'p1',name:'عاشقانه',d:'۱۲ رز قرمز در کاغذ زرشکی'}),
 Object.assign(def('bouquet',{mainT:'tulip',items:{tulip:[8,3],carn:[4,2],gerbera:[3,2]},model:'posy',paper:{c:2,style:'tissue'},ribbon:{on:true,c:4,style:'organza',w:'M'},jute:true,seed:11,green:{k:'rus',n:2},card:{on:true,m:'water',text:'بهار با تو قشنگ‌تره.',photo:null}}),{id:'p2',name:'بهار',d:'لاله و مینا گل، گرد کوچک'}),
 Object.assign(def('bouquet',{mainT:'rose',items:{rose:[7,2],lily:[3,1],baby:[3,0]},paper:{c:2,style:'matte'},ribbon:{on:true,c:2,style:'grosgrain',w:'M'},stem:60,seed:5,card:{on:true,m:'noir',text:'تبریک بابت این موفقیت بزرگ!',photo:null}}),{id:'p3',name:'فارغ‌التحصیلی',d:'رز و لیلیوم سفید'}),
 Object.assign(def('bouquet',{mainT:'gerbera',items:{gerbera:[9,0],carn:[5,2],baby:[2,0]},model:'hand',ribbon:{on:true,c:2,style:'satin',w:'M'},jute:true,seed:9,green:{k:'euc',n:3},card:{on:false,m:'kraft',text:'',photo:null}}),{id:'p4',name:'شادی',d:'ژربرای نارنجی، ساقه‌بلند'}),
 Object.assign(def('bouquet',{mainT:'rose',items:{rose:[9,1],lily:[2,0],baby:[3,0]},paper:{c:1,style:'tissue'},ribbon:{on:true,c:2,style:'organza',w:'L'},bloom:'open',seed:14,card:{on:true,m:'water',text:'',photo:null}}),{id:'p5',name:'رویای صورتی',d:'رز و لیلیوم صورتی'}),
 Object.assign(def('bouquet',{mainT:'rose',items:{rose:[6,5],gerbera:[5,0],lily:[2,1]},model:'arm',paper:{c:0,style:'kraft'},ribbon:{on:true,c:5,style:'grosgrain',w:'M'},jute:true,seed:21,green:{k:'rus',n:3},card:{on:true,m:'kraft',text:'',photo:null}}),{id:'p6',name:'پاییزی',d:'رنگ‌های گرم، بغلی'}),
 Object.assign(def('box',{model:'round',mainT:'rose',items:{rose:[12,0],baby:[2,0]},boxCol:2,ribbon:{on:true,c:1,style:'satin',w:'M'},bloom:'open',seed:4,card:{on:true,m:'noir',text:'',photo:null},green:{k:'euc',n:2}}),{id:'b1',name:'باکس رز سرخ',d:'باکس گرد مشکی'}),
 Object.assign(def('box',{model:'heart',mainT:'rose',items:{rose:[10,1],baby:[3,0]},boxCol:0,ribbon:{on:true,c:2,style:'satin',w:'M'},seed:8,card:{on:true,m:'rose',text:'',photo:null},green:{k:'euc',n:0}}),{id:'b2',name:'باکس قلب',d:'باکس قلبی صورتی'}),
 Object.assign(def('box',{model:'square',size:'S',mainT:'rose',items:{rose:[5,2],carn:[3,2]},boxCol:1,ribbon:{on:false,c:2,style:'satin',w:'M'},seed:6,card:{on:false,m:'kraft',text:'',photo:null},green:{k:'euc',n:1}}),{id:'b3',name:'باکس مینیمال',d:'سفید و ساده'}),
 Object.assign(def('box',{model:'rect',size:'L',mainT:'tulip',items:{tulip:[8,3],gerbera:[5,2],carn:[6,1],baby:[3,0]},boxCol:5,ribbon:{on:true,c:4,style:'grosgrain',w:'M'},seed:17,jute:true,green:{k:'rus',n:2},card:{on:true,m:'water',text:'',photo:null}}),{id:'b4',name:'باکس بهاری',d:'مخلوط رنگارنگ'}),
 Object.assign(def('box',{model:'round',mainT:'rose',items:{rose:[8,0],lily:[3,1]},boxCol:4,ribbon:{on:true,c:3,style:'satin',w:'M'},extras:['choc'],seed:2,card:{on:true,m:'kraft',text:'',photo:null}}),{id:'b5',name:'باکس هدیه ویژه',d:'همراه شکلات'})
];

/* ---------- محاسبات ---------- */
const count=c=>ORDER.reduce((a,k)=>a+(c.items[k]?c.items[k][0]:0),0);
const pts=c=>ORDER.reduce((a,k)=>a+(c.items[k]?c.items[k][0]*FL[k].vol:0),0)+(c.green.n||0)*.6;
const capOf=c=>SIZES[c.kind][c.size].cap;
const hasPaper=c=>c.kind==='bouquet'&&c.model!=='hand';
function breakdown(c){
 const P=PRICES,L=[];let t=0;const add=(l,v)=>{if(v>0){L.push([l,v]);t+=v}};
 const md=MODELS[c.kind].find(m=>m[0]===c.model);
 add(`${c.kind==='box'?'باکس':'دسته'} ${md[1]} ${SIZES[c.kind][c.size].n}`,P.base[c.model][c.size]);
 ORDER.forEach(k=>{const it=c.items[k];if(it&&it[0]>0){const col=FL[k].cols[it[1]];add(`${fa(it[0])} ${FL[k].n} ${col[0]}`,it[0]*P.stem[k]*P.stemLen[c.stem]*col[2])}});
 if(c.green.n>0)add(`${fa(c.green.n)} شاخه ${c.green.k==='euc'?'اکالیپتوس':'راسکوس'}`,c.green.n*P.green[c.green.k]);
 if(hasPaper(c))add('کاغذ '+PAPERS[c.paper.c][0],P.paperStyle[c.paper.style]);
 if(c.ribbon.on)add(`روبان ${RSTY[c.ribbon.style]} ${RIBS[c.ribbon.c][0]}`,P.ribbon[c.ribbon.style]+P.ribbonW[c.ribbon.w]);
 if(c.jute)add('نخ کنفی',P.jute);
 if(c.card.on)add('کارت '+CARDS.find(x=>x[0]===c.card.m)[1],P.card[c.card.m]);
 c.extras.forEach(e=>add(EXTRAS[e][0],P.extras[e]));
 add('چیدمان و بسته‌بندی',P.service);
 return{lines:L,tot:t};
}
const price=c=>breakdown(c).tot;
const RSTY={satin:'ساتن',organza:'ارگانزا',grosgrain:'گروگرن'};
function hsl(h){const n=parseInt(h.slice(1),16),r=(n>>16)/255,g=(n>>8&255)/255,b=(n&255)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let hh=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);hh=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;hh*=60}return[hh,s,l]}
function harmony(c){
 const cs=[];ORDER.forEach(k=>{const it=c.items[k];if(it&&it[0]&&!FL[k].filler)cs.push(hsl(FL[k].cols[it[1]][1]))});
 const ch=cs.filter(h=>h[1]>.28&&h[2]<.9);
 if(!count(c))return{t:'—',s:0,col:'var(--mut)'};
 if(!ch.length)return{t:'خنثی و ساده',s:82,col:'var(--ok)',tip:'ترکیب سفید و ملایم همیشه شیکه.'};
 const fam=[...new Set(ch.map(h=>Math.round(h[0]/30)%12))];let sp=0;ch.forEach(a=>ch.forEach(b=>{const d=Math.abs(a[0]-b[0]);sp=Math.max(sp,Math.min(d,360-d))}));
 if(fam.length===1)return{t:'تک‌رنگ',s:95,col:'var(--ok)'};
 if(sp<=65)return{t:'مشابه',s:90,col:'var(--ok)'};
 if(sp>=150&&fam.length<=2)return{t:'مکمل',s:84,col:'var(--ok)'};
 if(fam.length<=3)return{t:'سه‌رنگ متعادل',s:72,col:'var(--warn)',tip:'اگه شلوغ شد یکی از رنگ‌ها رو کمتر کن.'};
 return{t:'رنگارنگ',s:55,col:'var(--warn)',tip:'رنگ‌ها زیادن؛ برای هماهنگی بیشتر دو تا رو نگه دار.'};
}
function vaseLife(c){let w=0,s=0;ORDER.forEach(k=>{const it=c.items[k];if(it&&it[0]){w+=FL[k].vase*it[0];s+=it[0]}});if(!s)return 0;return Math.max(2,Math.round(w/s+(c.bloom==='bud'?2:c.bloom==='open'?-2:0)))}
function analyze(c){
 const n=count(c),p=pts(c),cap=capOf(c),W=[];
 if(n<MIN_F)W.push(['e',`حداقل ${fa(MIN_F)} شاخه‌ی گل لازمه (الان ${fa(n)}).`]);
 const fillN=ORDER.reduce((a,k)=>a+(FL[k].filler&&c.items[k]?c.items[k][0]:0),0),sh=n?fillN/n:0;
 if(n>=8&&sh<.08&&c.green.n<1)W.push(['w','گل یا سبزینه‌ی پرکننده کمه؛ ۱۰ تا ۲۵ درصد بهتره.']);
 if(sh>.4)W.push(['w','گل پرکننده زیاده و گل اصلی گم می‌شه.']);
 if(n>=5&&p/cap<.5)W.push(['w','هنوز جا برای گل بیشتر داری، طرح کم‌پشت دیده می‌شه.']);
 if(p/cap>=.97)W.push(['w','ظرفیت تقریباً پر شد.']);
 const h=harmony(c);if(h.s&&h.s<65&&h.tip)W.push(['w',h.tip]);
 if(c.card.on&&!c.card.text.trim())W.push(['w','کارت تبریک انتخاب شده ولی متنی ننوشتی.']);
 if(!W.length)W.push(['g','طرح متعادل و آماده‌ست.']);
 return W;
}
function desc(c){
 const md=MODELS[c.kind].find(m=>m[0]===c.model);
 const parts=ORDER.filter(k=>c.items[k]&&c.items[k][0]).map(k=>`${fa(c.items[k][0])} ${FL[k].n} ${FL[k].cols[c.items[k][1]][0]}`);
 return `${c.kind==='box'?'باکس':'دسته‌گل'} ${md[1]} ${SIZES[c.kind][c.size].n} | ${parts.join('، ')}${c.green.n?` | ${fa(c.green.n)} ${c.green.k==='euc'?'اکالیپتوس':'راسکوس'}`:''} | ${c.ribbon.on?'روبان '+RIBS[c.ribbon.c][0]:'بدون روبان'}${c.jute?' + نخ کنفی':''}${c.card.on?' | کارت':''}`;
}

/* ---------- نمایشگرها ---------- */
let HERO,STUDIO,THUMB;
const thumbEl=document.createElement('div');
function thumb(){return THUMB||(THUMB=new Viewer(thumbEl,{thumb:true,fov:27}))}
const photoCache={};
function prep(c){if(c.items){Object.keys(c.items).forEach(k=>{if(!FL[k])delete c.items[k];else if(c.items[k][1]>=FL[k].cols.length)c.items[k][1]=0})}if(c.card&&c.card.photo){const u=c.card.photo;if(!photoCache[u]){const im=new Image();im.onload=()=>{if(S&&S.card&&S.card.photo===u)buildStudio()};im.src=u;photoCache[u]=im}c.card.photoImg=photoCache[u]}return c}
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2200)};

/* ---------- وضعیت ویزارد ---------- */
let S=def('bouquet'),step=0,hist=[],hi=-1,lastTot=0;
const DELIV=Object.assign({branch:null,date:'',time:'۱۱ تا ۱۳',name:'',phone:'',anon:false,note:''},store.get('uf_deliv',{}));
const STEPS=[
 {id:'model',t:'مدل',h:'نوع و مدل محصول',p:'اول ببینیم دسته‌گل می‌خوای یا باکس گل، و چه مدلی.',f:'all'},
 {id:'main',t:'گل اصلی',h:'گل اصلی و تعدادش',p:'ستاره‌ی طرح رو انتخاب کن؛ بقیه‌ی گل‌ها دورش می‌چینن.',f:'flowers'},
 {id:'subs',t:'گل فرعی',h:'گل‌های فرعی و سبزینه',p:'گل‌های همراه و برگ‌های تزئینی، با مقدار دلخواه.',f:'flowers'},
 {id:'pack',t:'بسته‌بندی',h:'کاغذ دورپیچ یا رنگ باکس',p:'رنگ و جنس بسته‌بندی روی حس کلی طرح خیلی اثر داره.',f:'pack'},
 {id:'ribbon',t:'روبان',h:'روبان و رنگش',p:'جنس، پهنا و رنگ روبان و پاپیون.',f:'ribbon'},
 {id:'jute',t:'نخ کنفی',h:'نخ کنفی',p:'حس دست‌ساز و طبیعی؛ مثل نخ دور روبان یا به‌جای اون.',f:'ribbon'},
 {id:'card',t:'کارت',h:'کارت تبریک',p:'مدل کارت، متن و (اگه خواستی) عکس.',f:'card'},
 {id:'detail',t:'جزئیات',h:'جزئیات فنی و افزودنی‌ها',p:'مرحله‌ی شکفتگی، طول ساقه، افزودنی‌ها و یادداشت برای گل‌فروش.',f:'flowers'},
 {id:'deliver',t:'تحویل',h:'شعبه و زمان تحویل',p:'کجا و کی تحویل بگیری، و گیرنده کیه.',f:'all'},
 {id:'final',t:'مرور',h:'مرور نهایی',p:'دسته‌گل انتخابی تو. بچرخونش، بررسی کن و به سبد اضافه کن.',f:'all'}
];
function commit(){const j=JSON.stringify(S,(k,v)=>k==='photoImg'?undefined:v);if(hist[hi]===j)return;hist=hist.slice(0,hi+1);hist.push(j);if(hist.length>60)hist.shift();hi=hist.length-1}
function fixCap(){const cap=capOf(S);while(pts(S)>cap+1e-9){const k=[...ORDER].reverse().find(k=>S.items[k]&&S.items[k][0]>0&&k!==S.mainT)||S.mainT;if(S.items[k]&&S.items[k][0]>0)S.items[k][0]--;else if(S.green.n>0)S.green.n--;else break}}
function ensureMain(){if(!S.items[S.mainT]||S.items[S.mainT][0]<1){S.items[S.mainT]=[Math.min(5,Math.max(1,Math.floor(capOf(S)/3))),S.items[S.mainT]?S.items[S.mainT][1]:0]}}

/* ---------- ساخت صحنه‌ی استودیو ---------- */
let buildT=0;
function buildStudio(now){
 const run=()=>{S.seed=S.seed||7;STUDIO.setConfig(prep(S));refreshInfo()};
 if(now)run();else{clearTimeout(buildT);buildT=setTimeout(run,30)}
}
function refreshInfo(){
 const W=analyze(S),B=breakdown(S),cap=capOf(S),p=pts(S);
 $('#sPrice').textContent=T$(lastTot);tween($('#sPrice'),B.tot);
 $('#sCap').style.width=Math.min(100,p/cap*100)+'%';
 $('#sCapT').textContent=`${fa(Math.round(p*10)/10)} از ${fa(cap)} واحد`;
 const el=$('#stepWarn');if(el)el.innerHTML=W.map(w=>`<div class="${w[0]}">${w[1]}</div>`).join('');
 $('#bUndo').disabled=hi<=0;$('#bRedo').disabled=hi>=hist.length-1;
 const fin=$('#finBox');if(fin&&step===9)renderFinal();
}
function tween(el,to){const from=lastTot;lastTot=to;const t0=performance.now();cancelAnimationFrame(tween.r);const st=t=>{const k=Math.min(1,(t-t0)/450),e=1-Math.pow(1-k,3);el.textContent=T$(from+(to-from)*e);if(k<1)tween.r=requestAnimationFrame(st)};tween.r=requestAnimationFrame(st)}
function change(fn,rebuild=true){const before=count(S);fn();fixCap();commit();renderPanel(true);if(rebuild){buildStudio();if(window.UFX)UFX.onChange(count(S)>before)}else refreshInfo()}

/* ---------- تصاویر آیکن ---------- */
const iconCache={};
let ICONV;function flowerIcon(type,hex,open){const k=type+hex;return iconCache[k]||(iconCache[k]=(ICONV||(ICONV=new PhotoViewer(null,{thumb:true}))).icon(type,hex,open,170))}
const modelCache={};
function modelThumb(kind,model){
 const k=kind+model+'|'+S.items[S.mainT][1]+S.mainT+'|'+S.paper.c+S.boxCol;if(modelCache[k])return modelCache[k];
 const c=def(kind,{model,size:'M',mainT:S.mainT,items:{[S.mainT]:[8,S.items[S.mainT][1]],baby:[3,0]},paper:S.paper,boxCol:S.boxCol,green:{k:'euc',n:1},card:{on:false,m:'kraft',text:'',photo:null},ribbon:{on:true,c:S.ribbon.c,style:'satin',w:'M'},seed:7});
 return modelCache[k]=thumb().snapshotFree(c,230);
}
const cardCache={};
function cardThumb(m){if(cardCache[m])return cardCache[m];const c=SC.drawCard({m,text:'با بهترین آرزوها',photoImg:S.card.photoImg},384,256);return cardCache[m]=c.toDataURL('image/jpeg',.85)}

/* ---------- پنل مرحله‌ها ---------- */
const sw=(arr,cur,act,extra='')=>`<div class="sw">${arr.map((c,i)=>`<button type="button" title="${c[0]}" aria-label="${c[0]}" class="${i===cur?'on':''}" style="background:${c[1]}" data-a="${act}" data-v="${i}" ${extra}></button>`).join('')}</div>`;
const seg=(opts,cur,act,fmt)=>`<div class="seg">${opts.map(o=>`<button type="button" class="${cur===o[0]?'on':''}" data-a="${act}" data-v="${o[0]}">${fmt?fmt(o):o[1]}</button>`).join('')}</div>`;
function stepper(k,n,can){return `<div class="step"><button type="button" data-a="minus" data-k="${k}" ${n<=0?'disabled':''} aria-label="کم">−</button><span>${fa(n)}</span><button type="button" data-a="plus" data-k="${k}" ${!can?'disabled':''} aria-label="زیاد">+</button></div>`}
function flowerRow(k,main){
 const f=FL[k],it=S.items[k]||[0,Math.min(S.items[k]?S.items[k][1]:0,f.cols.length-1)],col=f.cols[it[1]||0],unit=PRICES.stem[k]*PRICES.stemLen[S.stem]*col[2];
 const can=pts(S)+f.vol<=capOf(S)+1e-9;
 return `<div class="frow ${main?'main':''}"><img class="ic" alt="${f.n}" src="${flowerIcon(k,col[1],BLOOM[S.bloom][1])}"><div class="nm"><b>${f.n}${f.filler?' <i>پرکننده</i>':''}</b><small>${f.desc} • ${T$(unit)} هر شاخه • ماندگاری حدود ${fa(f.vase)} روز</small>${f.cols.length>1?`<div class="sw sm" style="margin-top:8px">${f.cols.map((c,i)=>`<button type="button" title="${c[0]}${c[2]>1?' (+'+fa(Math.round((c[2]-1)*100))+'٪)':''}" aria-label="${c[0]}" class="${i===(it[1]||0)?'on':''}" style="background:${c[1]}" data-a="fc" data-k="${k}" data-v="${i}"></button>`).join('')}</div>`:''}</div>${stepper(k,it[0]||0,can)}</div>`;
}
/* ---------- طراح هوشمند ---------- */
let BUD=store.get('uf_bud',2000000),VIBE=store.get('uf_vibe','love');
const VIBES=[['love','عاشقانه',['p1','b1']],['soft','لطیف و صورتی',['p5','b2']],['elegant','شیک و مینیمال',['p3','b3']],['fresh','شاد و بهاری',['p2','b4']],['sunny','پرانرژی',['p4','b4']],['warm','گرم و پاییزی',['p6','b5']]];
function smartBlock(){
 return `<div class="blk smart"><h4>طراح هوشمند <small>حال‌وهوا و بودجه‌ات رو بگو، یک طرح کامل پیشنهاد می‌دم</small></h4>
 <div class="chips">${VIBES.map(v=>`<button type="button" class="chip2 ${VIBE===v[0]?'on':''}" data-a="vibe" data-v="${v[0]}">${v[1]}</button>`).join('')}</div>
 <div class="rng"><label for="budget">بودجه</label><input type="range" id="budget" min="600000" max="6000000" step="100000" value="${BUD}"><output id="budOut">${T$(BUD)}</output></div>
 <div class="acts2"><button type="button" class="btn sm" data-a="smart">پیشنهاد بده</button></div></div>`;
}
function smartDesign(){
 const vb=VIBES.find(v=>v[0]===VIBE)||VIBES[0],id=vb[2][S.kind==='box'?1:0],tpl=PRESETS.find(p=>p.id===id);
 const o=clone(tpl);delete o.id;delete o.name;delete o.d;
 const keepOcc=S.occasion,keepNote=S.note;
 const n=Object.assign(def(o.kind),o);n.occasion=keepOcc;n.note=keepNote;
 n.size=BUD<1300000?'S':BUD<3000000?'M':'L';
 const cap=SIZES[n.kind][n.size].cap;
 const base=clone(n.items);
 const build=f=>{const it={};ORDER.forEach(k=>{if(base[k]){const v=Math.round(base[k][0]*f);it[k]=[Math.max(k===n.mainT?1:0,v),base[k][1]]}});return it};
 const tot0=ORDER.reduce((a,k)=>a+(base[k]?base[k][0]*FL[k].vol:0),0)+(n.green.n||0)*.6;
 let f=cap*.85/Math.max(1,tot0);n.items=build(f);
 for(let i=0;i<40;i++){
  const ok=price(n)<=BUD&&pts(n)<=cap+1e-9;if(ok||f<.2)break;f*=.93;n.items=build(f);
 }
 while(count(n)<MIN_F&&pts(n)+FL[n.mainT].vol<=cap)n.items[n.mainT][0]++;
 n.seed=Math.floor(Math.random()*9000)+1;
 // اگه بودجه خیلی بیشتره، کارت و افزودنی اضافه کن
 if(BUD>3500000&&n.kind==='bouquet'&&!n.extras.includes('choc'))n.extras=['choc'];
 S=n;fixCap();commit();renderPanel(true);buildStudio(true);if(window.UFX)UFX.onChange(true);
 toast(`طرح ${vb[1]} با حدود ${T$(price(S))}`);
}
function panel(){
 const s=STEPS[step],c=S;
 switch(s.id){
 case 'model':return `${smartBlock()}<div class="blk"><h4>نوع</h4>${seg([['bouquet','دسته‌گل'],['box','باکس گل']],c.kind,'kind')}</div>
  <div class="blk"><h4>مدل <small>${c.kind==='box'?'شکل باکس':'فرم دسته'}</small></h4><div class="mgrid">${MODELS[c.kind].map(m=>`<button type="button" class="mcard ${c.model===m[0]?'on':''}" data-a="model" data-v="${m[0]}"><span class="mi" data-mt="${m[0]}"></span><b>${m[1]}</b><small>${m[2]}</small></button>`).join('')}</div></div>
  <div class="blk"><h4>اندازه <small>ظرفیت بر حسب واحد حجم گل</small></h4>${seg(Object.entries(SIZES[c.kind]).map(([k,v])=>[k,v]),c.size,'size',o=>`${o[1].n}<small>تا ${fa(o[1].cap)} واحد</small>`)}</div>
  <div class="blk"><h4>مناسبت <small>اختیاری؛ برای پیشنهاد متن کارت</small></h4><div class="chips">${Object.entries(OCCASIONS).map(([k,v])=>`<button type="button" class="chip2 ${c.occasion===k?'on':''}" data-a="occ" data-v="${k}">${v[0]}</button>`).join('')}</div></div>`;
 case 'main':return `<div class="blk"><h4>نوع گل اصلی</h4><div class="tgrid">${MAINS.map(k=>`<button type="button" class="tcard ${c.mainT===k?'on':''}" data-a="mainT" data-v="${k}"><img alt="" src="${flowerIcon(k,FL[k].cols[(c.items[k]||[0,0])[1]||0][1],BLOOM[c.bloom][1])}"><b>${FL[k].n}</b><small>${FL[k].desc}</small></button>`).join('')}</div></div>
  <div class="blk"><h4>رنگ و تعداد <small>حداقل ${fa(MIN_F)} شاخه‌ی کل طرح</small></h4>${flowerRow(c.mainT,true)}</div>`;
 case 'subs':{const subs=ORDER.filter(k=>k!==c.mainT);
  return `<div class="blk"><h4>گل‌های فرعی <small>هرکدوم رو می‌تونی صفر بذاری</small></h4>${subs.map(k=>flowerRow(k)).join('')}</div>
  <div class="blk"><h4>سبزینه <small>برگ تزئینی دور گل‌ها</small></h4>${seg([['none','بدون'],['euc','اکالیپتوس'],['rus','راسکوس']],c.green.n?c.green.k:'none','green')}${c.green.n?`<div class="grow"><span>تعداد شاخه</span>${stepper('green',c.green.n,c.green.n<6&&pts(c)+.6<=capOf(c))}</div>`:''}</div>`}
 case 'pack':
  if(c.kind==='box')return `<div class="blk"><h4>رنگ باکس</h4>${sw(BOXCOL,c.boxCol,'boxCol')}<p class="hint" style="margin-top:8px">${BOXCOL[c.boxCol][0]}</p></div>`;
  if(c.model==='hand')return `<div class="blk"><div class="empty">این مدل کاغذ دورپیچ نداره؛ ساقه‌ها با روبان بسته می‌شن. اگه کاغذ می‌خوای، مدل رو به «دورپیچ کلاسیک» یا «گرد کوچک» تغییر بده.</div><div class="acts2"><button type="button" class="btn ghost sm" data-a="model" data-v="wrap">تغییر به دورپیچ کلاسیک</button></div></div>`;
  return `<div class="blk"><h4>رنگ کاغذ</h4>${sw(PAPERS,c.paper.c,'paper')}<p class="hint" style="margin-top:8px">${PAPERS[c.paper.c][0]}</p></div>
  <div class="blk"><h4>جنس کاغذ</h4>${seg([['kraft','کرافت'],['matte','مات ضخیم'],['tissue','شفاف (تیشو)']],c.paper.style,'pstyle',o=>`${o[1]}<small>${PRICES.paperStyle[o[0]]?'+'+T$(PRICES.paperStyle[o[0]]):'بدون هزینه'}</small>`)}</div>`;
 case 'ribbon':return `<div class="blk"><h4>روبان</h4>${seg([['1','دارد'],['0','بدون روبان']],c.ribbon.on?'1':'0','rbon')}</div>`+(c.ribbon.on?`
  <div class="blk"><h4>رنگ روبان</h4>${sw(RIBS,c.ribbon.c,'rbc')}<p class="hint" style="margin-top:8px">${RIBS[c.ribbon.c][0]}</p></div>
  <div class="blk"><h4>جنس</h4>${seg([['satin','ساتن<small>براق و نرم</small>'],['organza','ارگانزا<small>شفاف و سبک</small>'],['grosgrain','گروگرن<small>مات و بافت‌دار</small>']],c.ribbon.style,'rbs',o=>o[1])}</div>
  <div class="blk"><h4>پهنا</h4>${seg([['S','باریک'],['M','متوسط'],['L','پهن']],c.ribbon.w,'rbw')}</div>`:'');
 case 'jute':return `<div class="blk"><h4>نخ کنفی</h4>${seg([['1','با نخ کنفی'],['0','بدون نخ کنفی']],c.jute?'1':'0','jute',o=>`${o[1]}${o[0]==='1'?`<small>+${T$(PRICES.jute)}</small>`:''}`)}<p class="hint" style="margin-top:12px">نخ کنفی چند دور دور محل بسته شدن می‌پیچه و با یه گره‌ی کوچک بسته می‌شه. با روبان ترکیب هم می‌شه.</p></div>`;
 case 'card':{const occ=OCCASIONS[c.occasion][1];
  return `<div class="blk"><h4>کارت تبریک</h4>${seg([['1','با کارت'],['0','بدون کارت']],c.card.on?'1':'0','cardon')}</div>`+(c.card.on?`
  <div class="blk"><h4>مدل کارت</h4><div class="cgrid">${CARDS.map(m=>`<button type="button" class="ccard ${c.card.m===m[0]?'on':''}" data-a="cardm" data-v="${m[0]}"><img alt="" src="${cardThumb(m[0])}"><b>${m[1]}</b><small>${m[2]} • ${T$(PRICES.card[m[0]])}</small></button>`).join('')}</div></div>
  ${c.card.m==='photo'?`<div class="blk"><h4>عکس کارت</h4><div class="up"><input type="file" id="photoIn" accept="image/*"><label for="photoIn" class="btn ghost sm">${c.card.photo?'تعویض عکس':'انتخاب عکس'}</label>${c.card.photo?'<button type="button" class="btn ghost sm" data-a="photoDel">حذف عکس</button>':''}</div></div>`:''}
  <div class="blk"><h4>متن کارت <small id="cc">${fa(160-c.card.text.length)} حرف باقی‌مونده</small></h4><textarea id="cardT" maxlength="160" placeholder="متنت رو بنویس...">${c.card.text.replace(/</g,'&lt;')}</textarea>
  ${occ.length?`<div class="chips" style="margin-top:10px">${occ.map((t,i)=>`<button type="button" class="chip2" data-a="sugg" data-v="${i}">${t}</button>`).join('')}</div>`:'<p class="hint" style="margin-top:8px">برای پیشنهاد متن، مناسبت رو توی مرحله‌ی اول انتخاب کن.</p>'}</div>`:'')}
 case 'detail':return `<div class="blk"><h4>مرحله‌ی شکفتگی <small>روی ماندگاری اثر داره</small></h4>${seg(Object.entries(BLOOM).map(([k,v])=>[k,v[0]]),c.bloom,'bloom')}</div>
  <div class="blk"><h4>طول ساقه <small>۴۰ ارزان‌تر، ۶۰ گران‌تر</small></h4>${seg(Object.keys(PRICES.stemLen).map(k=>[k,fa(k)+' سانتی‌متر']),String(c.stem),'stem',o=>`${o[1]}<small>×${fa(PRICES.stemLen[o[0]])}</small>`)}</div>
  <div class="blk"><h4>افزودنی‌ها</h4>${Object.entries(EXTRAS).map(([k,v])=>`<label class="exr"><input type="checkbox" data-a="ex" data-v="${k}" ${c.extras.includes(k)?'checked':''}><span>${v[0]}${v[1]?'':' <i>بدون نمایش سه‌بعدی</i>'}</span><b>${T$(PRICES.extras[k])}</b></label>`).join('')}</div>
  <div class="blk"><h4>یادداشت برای گل‌فروش <small>اختیاری</small></h4><textarea id="noteT" maxlength="200" placeholder="مثلاً: رنگ گل‌ها ملایم‌تر باشه">${(c.note||'').replace(/</g,'&lt;')}</textarea></div>`;
 case 'deliver':return `<div class="blk"><h4>شعبه‌ی تحویل</h4><div class="bsel">${BRANCHES.filter(b=>!b.soon).map(b=>`<button type="button" class="${(DELIV.branch||branch)===b.id?'on':''}" style="--bc:${b.c}" data-a="dbranch" data-v="${b.id}"><b>${b.name}</b><small>${b.spot} • ${b.hours}</small></button>`).join('')}</div></div>
  <div class="blk"><h4>زمان</h4><div class="f2"><div class="fld"><label for="dDate">تاریخ</label><input class="in" type="date" id="dDate" value="${DELIV.date||new Date(Date.now()+864e5).toISOString().slice(0,10)}" min="${new Date().toISOString().slice(0,10)}"></div><div class="fld"><label for="dTime">بازه‌ی ساعت</label><select class="in" id="dTime">${['۹ تا ۱۱','۱۱ تا ۱۳','۱۳ تا ۱۵','۱۵ تا ۱۷','۱۷ تا ۱۹'].map(t=>`<option ${DELIV.time===t?'selected':''}>${t}</option>`).join('')}</select></div></div></div>
  <div class="blk"><h4>گیرنده و فرستنده</h4><div class="f2"><div class="fld"><label for="dName">نام گیرنده</label><input class="in" id="dName" value="${(DELIV.name||'').replace(/"/g,'')}"></div><div class="fld"><label for="dPhone">شماره‌ی تماس شما</label><input class="in" id="dPhone" inputmode="tel" placeholder="۰۹۱۲..." value="${DELIV.phone||''}"></div></div>
  <label class="exr"><input type="checkbox" id="dAnon" ${DELIV.anon?'checked':''}><span>فرستنده ناشناس بمونه <i>گیرنده اسم شما رو نمی‌شنوه</i></span></label></div>`;
 case 'final':return `<div id="finBox"></div>`;
 }
}
function renderPanel(keepScroll){
 const s=STEPS[step],body=$('#stepBody');
 $('#stepHead').innerHTML=`<small>مرحله‌ی ${fa(step+1)} از ${fa(STEPS.length)}</small><h3 class="disp">${s.h}</h3><p>${s.p}</p>`;
 const sc=keepScroll?window.scrollY:0;
 body.innerHTML=panel();
 if(!keepScroll){const h=$('#stepHead');[h,body].forEach(e=>{e.classList.remove('enter');void e.offsetWidth;e.classList.add('enter')})}
 $('#stepNav').innerHTML=`<button type="button" class="btn ghost" data-a="prev" ${step===0?'disabled':''}>قبلی</button>${step<STEPS.length-1?`<button type="button" class="btn" data-a="next">${STEPS[step+1].t}</button>`:`<button type="button" class="btn" data-a="addcart" ${analyze(S).some(w=>w[0]==='e')?'disabled':''}>افزودن به سبد خرید</button>`}`;
 $$('#stepper li').forEach((li,i)=>{li.classList.toggle('on',i===step);li.classList.toggle('done',i<step)});
 STUDIO.idle=(s.id==='final'&&!REDUCE)?1:0;
 // تصاویر مدل‌ها را تنبل بساز
 if(s.id==='model'){$$('.mi[data-mt]').forEach((el,i)=>setTimeout(()=>{if(el.isConnected&&!el.firstChild){const im=new Image();im.alt='';im.src=modelThumb(S.kind,el.dataset.mt);el.appendChild(im)}},i*60))}
 if(s.id==='final')renderFinal();
 if(keepScroll)window.scrollTo(0,sc);
 refreshInfo();
}
function renderFinal(){
 const B=breakdown(S),W=analyze(S),h=harmony(S),vl=vaseLife(S),md=MODELS[S.kind].find(m=>m[0]===S.model);
 const rows=[['مدل',`${S.kind==='box'?'باکس':'دسته‌گل'} ${md[1]} ${SIZES[S.kind][S.size].n}`,0],['گل‌ها',ORDER.filter(k=>S.items[k]&&S.items[k][0]).map(k=>`${fa(S.items[k][0])} ${FL[k].n} ${FL[k].cols[S.items[k][1]][0]}`).join('، ')+(S.green.n?`، ${fa(S.green.n)} ${S.green.k==='euc'?'اکالیپتوس':'راسکوس'}`:''),1],
  [S.kind==='box'?'باکس':'کاغذ',S.kind==='box'?BOXCOL[S.boxCol][0]:(hasPaper(S)?PAPERS[S.paper.c][0]+' / '+({kraft:'کرافت',matte:'مات',tissue:'شفاف'})[S.paper.style]:'بدون کاغذ'),3],
  ['روبان',S.ribbon.on?`${RSTY[S.ribbon.style]} ${RIBS[S.ribbon.c][0]}، پهنای ${({S:'باریک',M:'متوسط',L:'پهن'})[S.ribbon.w]}`:'ندارد',4],['نخ کنفی',S.jute?'دارد':'ندارد',5],['کارت',S.card.on?CARDS.find(x=>x[0]===S.card.m)[1]+(S.card.text?`: «${S.card.text.slice(0,60)}»`:''):'ندارد',6],
  ['جزئیات',`${BLOOM[S.bloom][0]} • ساقه ${fa(S.stem)} سم${S.extras.length?' • '+S.extras.map(e=>EXTRAS[e][0]).join('، '):''}`,7],['تحویل',`${BRANCHES.find(b=>b.id===(DELIV.branch||branch)).name} • ${DELIV.date||'فردا'} • ${DELIV.time}`,8]];
 $('#finBox').innerHTML=`<div class="fin"><dl class="fsum">${rows.map(r=>`<div><dt>${r[0]}</dt><dd>${r[1]}${r[2]?`<button type="button" class="lnk" data-a="goto" data-v="${r[2]}">ویرایش</button>`:''}</dd></div>`).join('')}</dl>
 <div class="specs"><div><small>تعداد شاخه</small><b>${fa(count(S))}</b></div><div><small>ماندگاری تقریبی</small><b>${vl?fa(vl)+' روز':'—'}</b></div><div><small>هماهنگی رنگ</small><b class="hb"><i style="background:${h.col}"></i>${h.t}${h.s?' • '+fa(h.s):''}</b></div></div>
 <div class="warns">${W.map(w=>`<div class="${w[0]}">${w[1]}</div>`).join('')}</div>
 <table class="bd2">${B.lines.map(l=>`<tr><td>${l[0]}</td><td>${T$(l[1])}</td></tr>`).join('')}<tr class="t"><td>جمع کل</td><td>${T$(B.tot)}</td></tr></table>
 <div class="acts"><button type="button" class="btn ghost sm" data-a="save">ذخیره‌ی طرح</button><button type="button" class="btn ghost sm" data-a="copy">کپی کد طرح</button><button type="button" class="btn ghost sm" data-a="import">بارگذاری کد</button><button type="button" class="btn ghost sm" data-a="poster">تصویر پوستر طرح</button></div><textarea id="codeT" placeholder="کد طرح رو اینجا بچسبون" style="direction:ltr;font-size:.74rem;min-height:46px;margin-top:8px"></textarea><div class="saved" id="saved"></div></div>`;
 renderSaved();
}
function renderSaved(){const el=$('#saved');if(!el)return;const L=store.get('uf_designs4',[]);el.innerHTML=L.map((d,i)=>`<div><span>${d.name}</span><button type="button" class="btn ghost sm" data-a="loadd" data-v="${i}">باز کن</button><button type="button" class="x" data-a="deld" data-v="${i}" aria-label="حذف">✕</button></div>`).join('')}

/* ---------- رویدادها ---------- */
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a,v=t.dataset.v,k=t.dataset.k;
 switch(a){
 case 'vibe':VIBE=v;store.set('uf_vibe',v);$$('[data-a=vibe]').forEach(b=>b.classList.toggle('on',b.dataset.v===v));return;
 case 'smart':smartDesign();return;
 case 'poster':if(window.UFX)UFX.poster();return;
 case 'next':step=Math.min(STEPS.length-1,step+1);goStep();return;
 case 'prev':step=Math.max(0,step-1);goStep();return;
 case 'goto':step=+v;goStep();return;
 case 'kind':if(S.kind===v)return;change(()=>{const o=S;S=def(v);S.items=o.items;S.mainT=o.mainT;S.bloom=o.bloom;S.stem=o.stem;S.seed=o.seed;S.extras=o.extras;S.occasion=o.occasion;S.card=o.card;S.green=o.green;S.ribbon=o.ribbon;S.jute=o.jute;S.paper=o.paper;S.boxCol=o.boxCol;S.note=o.note});return;
 case 'model':if(S.model===v)return;change(()=>{S.model=v});return;
 case 'size':change(()=>{S.size=v});return;
 case 'occ':change(()=>{S.occasion=v},false);return;
 case 'mainT':change(()=>{const o=S.items[S.mainT]||[5,0],n=o[0];if(S.mainT!==v){delete S.items[S.mainT];const ex=S.items[v];S.mainT=v;S.items[v]=ex?[Math.max(ex[0],n),Math.min(ex[1],FL[v].cols.length-1)]:[n,Math.min(o[1],FL[v].cols.length-1)]}});return;
 case 'fc':change(()=>{S.items[k]=S.items[k]||[0,0];S.items[k][1]=+v;if(!S.items[k][0]&&pts(S)+FL[k].vol<=capOf(S))S.items[k][0]=1});return;
 case 'plus':if(k==='green'){change(()=>{S.green.n++});return}if(pts(S)+FL[k].vol>capOf(S)+1e-9)return;change(()=>{S.items[k]=S.items[k]||[0,0];S.items[k][0]++});return;
 case 'minus':if(k==='green'){change(()=>{S.green.n--});return}change(()=>{S.items[k][0]--;if(k===S.mainT&&S.items[k][0]<1)S.items[k][0]=1});return;
 case 'green':change(()=>{if(v==='none')S.green.n=0;else{S.green.k=v;if(!S.green.n)S.green.n=2}});return;
 case 'paper':change(()=>{S.paper.c=+v});return;
 case 'pstyle':change(()=>{S.paper.style=v});return;
 case 'boxCol':change(()=>{S.boxCol=+v});return;
 case 'rbon':change(()=>{S.ribbon.on=v==='1'});return;
 case 'rbc':change(()=>{S.ribbon.c=+v});return;
 case 'rbs':change(()=>{S.ribbon.style=v});return;
 case 'rbw':change(()=>{S.ribbon.w=v});return;
 case 'jute':change(()=>{S.jute=v==='1'});return;
 case 'cardon':change(()=>{S.card.on=v==='1'});return;
 case 'cardm':change(()=>{S.card.m=v});return;
 case 'photoDel':change(()=>{S.card.photo=null;S.card.photoImg=null});return;
 case 'sugg':change(()=>{S.card.text=OCCASIONS[S.occasion][1][+v]});return;
 case 'bloom':change(()=>{S.bloom=v;Object.keys(iconCache).forEach(x=>delete iconCache[x])});return;
 case 'stem':change(()=>{S.stem=+v});return;
 case 'ex':change(()=>{const i=S.extras.indexOf(v);i<0?S.extras.push(v):S.extras.splice(i,1)});return;
 case 'dbranch':DELIV.branch=v;store.set('uf_deliv',DELIV);renderPanel(true);return;
 case 'addcart':addToCart(S,S.kind==='box'?'باکس گل سفارشی':'دسته‌گل سفارشی');return;
 case 'undo':if(hi>0){hi--;S=JSON.parse(hist[hi]);renderPanel(true);buildStudio(true)}return;
 case 'redo':if(hi<hist.length-1){hi++;S=JSON.parse(hist[hi]);renderPanel(true);buildStudio(true)}return;
 case 'shuffle':change(()=>{S.seed=Math.floor(Math.random()*9000)+1});return;
 case 'overview':STUDIO.focus('all');return;
 case 'save':{const L=store.get('uf_designs4',[]);const sn=clone(S);L.unshift({name:`طرح ${fa(L.length+1)} • ${T$(price(S))}`,cfg:sn});try{store.set('uf_designs4',L.slice(0,5))}catch(x){}renderSaved();toast('طرح ذخیره شد');return}
 case 'loadd':{const d=store.get('uf_designs4',[])[+v];if(d){S=Object.assign(def(d.cfg.kind),d.cfg);commit();renderPanel(true);buildStudio(true);toast('طرح بارگذاری شد')}return}
 case 'deld':{const L=store.get('uf_designs4',[]);L.splice(+v,1);store.set('uf_designs4',L);renderSaved();return}
 case 'copy':{const code=btoa(unescape(encodeURIComponent(JSON.stringify(clone(S)))));const ta=$('#codeT');ta.value=code;ta.select();try{navigator.clipboard.writeText(code).then(()=>toast('کد کپی شد'),()=>toast('کد انتخاب شد، دستی کپی کن'))}catch(x){toast('کد انتخاب شد، دستی کپی کن')}return}
 case 'import':try{const o=JSON.parse(decodeURIComponent(escape(atob($('#codeT').value.trim()))));if(!o.items||!o.kind)throw 0;S=Object.assign(def(o.kind),o);fixCap();commit();renderPanel(true);buildStudio(true);toast('طرح بارگذاری شد')}catch(x){toast('کد معتبر نیست')}return;
 }
});
function goStep(){renderPanel();STUDIO.focus(STEPS[step].f);if(STEPS[step].id==='final'&&window.UFX)UFX.onFinal();const el=$('#studio');if(el){const r=el.getBoundingClientRect();if(r.top<-200)el.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'})}}
$('#stepper').addEventListener('click',e=>{const li=e.target.closest('li');if(!li)return;step=+li.dataset.i;goStep()});
let tdeb;
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.id==='budget'){BUD=+t.value;store.set('uf_bud',BUD);$('#budOut').textContent=T$(BUD)}
 else if(t.id==='cardT'){S.card.text=t.value;$('#cc').textContent=fa(160-t.value.length)+' حرف باقی‌مونده';clearTimeout(tdeb);tdeb=setTimeout(()=>{commit();buildStudio(true)},280)}
 else if(t.id==='noteT'){S.note=t.value}
 else if(t.id==='dName'){DELIV.name=t.value;store.set('uf_deliv',DELIV)}
 else if(t.id==='dPhone'){DELIV.phone=t.value;store.set('uf_deliv',DELIV)}
});
document.addEventListener('change',e=>{
 const t=e.target;
 if(t.id==='dDate'){DELIV.date=t.value;store.set('uf_deliv',DELIV)}
 else if(t.id==='dTime'){DELIV.time=t.value;store.set('uf_deliv',DELIV)}
 else if(t.id==='dAnon'){DELIV.anon=t.checked;store.set('uf_deliv',DELIV)}
 else if(t.id==='photoIn'&&t.files&&t.files[0]){
  const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,640/Math.max(im.width,im.height)),c=F.mkC(Math.round(im.width*k),Math.round(im.height*k));c.getContext('2d').drawImage(im,0,0,c.width,c.height);const u=c.toDataURL('image/jpeg',.82);change(()=>{S.card.photo=u});};im.src=fr.result};fr.readAsDataURL(t.files[0]);
 }
});
$('#bUndo').onclick=()=>{if(hi>0){hi--;S=JSON.parse(hist[hi]);renderPanel(true);buildStudio(true)}};
$('#bRedo').onclick=()=>{if(hi<hist.length-1){hi++;S=JSON.parse(hist[hi]);renderPanel(true);buildStudio(true)}};
$('#bShuf').onclick=()=>change(()=>{S.seed=Math.floor(Math.random()*9000)+1});
$('#bOver').onclick=()=>STUDIO.focus('all');

/* ---------- شعبه‌ها ---------- */
function renderBranches(){
 $('#hdrBranch').innerHTML=BRANCHES.filter(b=>!b.soon).map(b=>`<option value="${b.id}" ${b.id===branch?'selected':''}>${b.name}</option>`).join('');
 $('#branchGrid').innerHTML=BRANCHES.map(b=>`<button class="brow ${b.id===branch?'on':''}" style="--bc:${b.c}" data-b="${b.id}" ${b.soon?'disabled':''}><span class="bm"></span><span class="bn">${b.name}</span><span class="bu">${b.uni}</span><span class="bh">${b.soon?'':b.hours}</span></button>`).join('');
 const b=curBranch(),rs=document.documentElement.style;
 rs.setProperty('--accent',b.c);rs.setProperty('--accent-d',shade(b.c,-.22));rs.setProperty('--soft',b.c+'1c');
 const nf=PRESETS.filter(p=>b.feat.includes(p.id)).length;
 $('#binfo').innerHTML=`<small>شعبه‌ی انتخاب‌شده</small><h3 class="disp">${b.name}</h3><p>${b.uni}</p><dl><div><dt>ساعت کاری</dt><dd>${b.hours}</dd></div><div><dt>محل تحویل</dt><dd>${b.spot}</dd></div><div><dt>طرح ویژه</dt><dd>${fa(nf)} طرح</dd></div></dl>`;
 $('#shopSub').textContent=`طرح‌های ویژه‌ی ${b.name} اول لیست و با برچسب مشخص شده‌اند.`;
 $('#ftBranches').textContent=BRANCHES.filter(x=>!x.soon).map(x=>x.name).join(' • ');
 store.set('uf_branch',branch);
}
function setBranch(id){branch=id;setTimeout(()=>window.UFX&&UFX.onBranch(),60);if(!DELIV.branch||true){DELIV.branch=id;store.set('uf_deliv',DELIV)}renderBranches();renderGrid();if(STEPS[step].id==='deliver')renderPanel(true)}
document.addEventListener('click',e=>{const c=e.target.closest('[data-b]');if(c&&!c.disabled)setBranch(c.dataset.b)});
$('#hdrBranch').onchange=e=>setBranch(e.target.value);

/* ---------- کاتالوگ ---------- */
let kind='all',sort='pop';const pThumb={};
function tint(p){let best=null,bn=0;ORDER.forEach(k=>{const it=p.items[k];if(it&&it[0]>bn&&!FL[k].filler){bn=it[0];best=FL[k].cols[it[1]][1]}});return best||'#e8789a'}
function renderGrid(){
 const b=curBranch();let L=PRESETS.filter(p=>kind==='all'||p.kind===kind).map(p=>({p,pr:price(p),f:b.feat.indexOf(p.id)}));
 if(sort==='asc')L.sort((a,b)=>a.pr-b.pr);else if(sort==='desc')L.sort((a,b)=>b.pr-a.pr);else L.sort((a,b)=>(b.f>=0)-(a.f>=0)||(a.f-b.f));
 $('#grid').innerHTML=L.map(({p,pr,f},i)=>`<article class="pc" style="--i:${i%4}"><div class="tile" style="--t:${tint(p)}">${f>=0?`<span class="ftag">ویژه‌ی ${b.name}</span>`:''}<div class="ph" data-pid="${p.id}">${pThumb[p.id]?`<img alt="${p.name}" src="${pThumb[p.id]}">`:''}</div><button class="quick" data-add="${p.id}">افزودن به سبد</button></div><div class="pi"><h3>${p.name}</h3><span class="pp">${T$(pr)}</span></div><p class="pm">${p.kind==='box'?'باکس':'دسته‌گل'} • ${p.d} • ${fa(count(p))} گل</p><button class="lnk" data-cust="${p.id}">شخصی‌سازی این طرح</button></article>`).join('');
 reveal($('#grid'));queueThumbs();
}
let thumbBusy=false;
function queueThumbs(){
 if(thumbBusy)return;const el=[...$$('.ph[data-pid]')].find(e=>!e.firstChild&&!pThumb[e.dataset.pid]);if(!el)return;thumbBusy=true;
 setTimeout(()=>{const p=PRESETS.find(x=>x.id===el.dataset.pid);try{pThumb[p.id]=thumb().snapshotFree(prep(clone(p)),420)}catch(x){pThumb[p.id]='';}
  $$(`.ph[data-pid="${p.id}"]`).forEach(h=>{if(pThumb[p.id]){const im=new Image();im.alt=p.name;im.src=pThumb[p.id];h.appendChild(im);requestAnimationFrame(()=>im.classList.add('in'))}});
  thumbBusy=false;queueThumbs()},40);
}
$$('.chip').forEach(c=>c.onclick=()=>{kind=c.dataset.k;$$('.chip').forEach(x=>x.classList.toggle('on',x===c));renderGrid()});
$('#sort').onchange=e=>{sort=e.target.value;renderGrid()};
document.addEventListener('click',e=>{
 const a=e.target.closest('[data-add]');if(a){const p=PRESETS.find(x=>x.id===a.dataset.add);addToCart(clone(p),p.name)}
 const c=e.target.closest('[data-cust]');if(c){const p=PRESETS.find(x=>x.id===c.dataset.cust);S=Object.assign(def(p.kind),clone(p));delete S.id;delete S.name;delete S.d;hist=[];hi=-1;commit();step=1;renderPanel();buildStudio(true);STUDIO.focus('flowers');$('#studio').scrollIntoView({behavior:REDUCE?'auto':'smooth'});toast('طرح رو توی مرحله‌ها تغییر بده')}
});

/* ---------- سبد ---------- */
let cart=store.get('uf_cart4',[]),stage='cart',lastOrder=null;
function addToCart(cfg,name){
 let img='';try{img=thumb().snapshotFree(prep(clone(cfg)),260)}catch(x){}
 cart.push({uid:Date.now()+Math.random(),name,cfg:clone(cfg),qty:1,img});saveCart();toast('به سبد خرید اضافه شد');if(window.UFX)UFX.onAdd(img);
}
function saveCart(){store.set('uf_cart4',cart);renderCart()}
const total=()=>cart.reduce((a,i)=>a+price(i.cfg)*i.qty,0);
function renderCart(){
 $('#cartN').textContent=fa(cart.reduce((a,i)=>a+i.qty,0));
 const body=$('#cartBody'),foot=$('#cartFoot');
 if(stage==='done'){body.innerHTML=`<div class="ok"><h3 class="disp" style="font-size:2rem">سفارشت ثبت شد</h3><p>کد پیگیری: <b>${lastOrder.code}</b></p><p class="hint">${lastOrder.branch} • ${lastOrder.when}<br>مبلغ: ${T$(lastOrder.sum)}</p><p class="hint" style="margin-top:12px">این نسخه‌ی نمایشیه و پرداخت و ارسال واقعی نداره.</p></div>`;foot.innerHTML=`<button class="btn" style="width:100%" id="closeDone">بستن</button>`;return}
 if(!cart.length){body.innerHTML=`<div class="ok"><p>سبد خریدت خالیه</p></div>`;foot.innerHTML='';return}
 if(stage==='cart'){
  body.innerHTML=cart.map(i=>`<div class="ci"><img alt="" src="${i.img||''}"><div class="t"><b>${i.name}</b><small>${desc(i.cfg)}</small>${i.cfg.card.on&&i.cfg.card.text?`<small>کارت: ${i.cfg.card.text.replace(/</g,'&lt;')}</small>`:''}<div class="step" style="margin-top:6px"><button type="button" data-q="-1" data-u="${i.uid}" aria-label="کم">−</button><span>${fa(i.qty)}</span><button type="button" data-q="1" data-u="${i.uid}" aria-label="زیاد">+</button><span style="flex:1"></span><b>${T$(price(i.cfg)*i.qty)}</b></div><button class="x" data-del="${i.uid}">حذف</button></div></div>`).join('');
  foot.innerHTML=`<div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:10px"><span>جمع کل</span><span>${T$(total())}</span></div><button class="btn" style="width:100%" id="toCheckout">ادامه و ثبت سفارش</button>`;
 }else{
  const bid=DELIV.branch||branch,b=BRANCHES.find(x=>x.id===bid)||curBranch(),d=DELIV.date||new Date(Date.now()+864e5).toISOString().slice(0,10);
  body.innerHTML=`<div class="fld"><label for="ckBranch">شعبه‌ی تحویل</label><select class="in" id="ckBranch">${BRANCHES.filter(x=>!x.soon).map(x=>`<option value="${x.id}" ${x.id===bid?'selected':''}>${x.name} | ${x.uni}</option>`).join('')}</select><small class="hint" id="ckSpot">${b.spot} • ${b.hours}</small></div><div class="f2"><div class="fld"><label for="ckDate">تاریخ</label><input class="in" type="date" id="ckDate" value="${d}" min="${new Date().toISOString().slice(0,10)}"></div><div class="fld"><label for="ckTime">ساعت</label><select class="in" id="ckTime">${['۹ تا ۱۱','۱۱ تا ۱۳','۱۳ تا ۱۵','۱۵ تا ۱۷','۱۷ تا ۱۹'].map(t=>`<option ${DELIV.time===t?'selected':''}>${t}</option>`).join('')}</select></div></div><div class="fld"><label for="ckName">نام گیرنده</label><input class="in" id="ckName" value="${(DELIV.name||'').replace(/"/g,'')}"></div><div class="fld"><label for="ckPhone">شماره‌ی تماس شما</label><input class="in" id="ckPhone" inputmode="tel" placeholder="۰۹۱۲..." value="${DELIV.phone||''}"></div><div class="fld"><label for="ckNote">توضیحات (اختیاری)</label><textarea id="ckNote"></textarea></div>`;
  foot.innerHTML=`<div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:10px"><span>مبلغ قابل پرداخت</span><span>${T$(total())}</span></div><div class="f2"><button class="btn ghost" id="backCart">بازگشت</button><button class="btn" id="placeOrder">ثبت سفارش</button></div>`;
 }
}
document.addEventListener('click',e=>{
 const t=e.target;
 if(t.closest('#openCart')){stage='cart';renderCart();openCart(true)}
 else if(t.closest('#closeCart')||t.id==='ov'||t.id==='closeDone'){if(stage==='done')stage='cart';openCart(false);renderCart()}
 else if(t.dataset.q){const i=cart.find(x=>x.uid==t.dataset.u);i.qty+=+t.dataset.q;if(i.qty<1)cart=cart.filter(x=>x!==i);saveCart()}
 else if(t.dataset.del){cart=cart.filter(x=>x.uid!=t.dataset.del);saveCart()}
 else if(t.id==='toCheckout'){stage='checkout';renderCart()}
 else if(t.id==='backCart'){stage='cart';renderCart()}
 else if(t.id==='placeOrder'){
  const nm=$('#ckName').value.trim(),ph=$('#ckPhone').value.trim().replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  if(!nm||ph.replace(/\D/g,'').length<10){toast('نام گیرنده و شماره‌ی تماس رو کامل کن');return}
  const b=BRANCHES.find(x=>x.id===$('#ckBranch').value);
  lastOrder={code:'UF-'+Math.random().toString(36).slice(2,7).toUpperCase(),branch:b.name,when:`${$('#ckDate').value} • ${$('#ckTime').value}`,sum:total()};
  cart=[];store.set('uf_cart4',cart);stage='done';renderCart();
 }
});
document.addEventListener('change',e=>{if(e.target.id==='ckBranch'){const b=BRANCHES.find(x=>x.id===e.target.value);$('#ckSpot').textContent=b.spot+' • '+b.hours}});
function openCart(on){$('#drawer').classList.toggle('on',on);$('#ov').classList.toggle('on',on)}

/* ---------- ورود ---------- */
function reveal(root){
 if(!('IntersectionObserver' in window)||REDUCE)return;
 const els=[...(root||document).querySelectorAll('[data-rv],.pc')].filter(e=>e.getBoundingClientRect().top>innerHeight*.95);
 const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.remove('pre');io.unobserve(x.target)}}),{threshold:.08});
 els.forEach(e=>{e.classList.add('pre');io.observe(e)});setTimeout(()=>els.forEach(e=>e.classList.remove('pre')),4000);
}
function onScroll(){const s=scrollY>30;$('header').classList.toggle('solid',s);document.body.classList.toggle('solid',s)}
addEventListener('scroll',onScroll,{passive:true});
$('#logo').innerHTML=`<span class="lg"></span><span>یونی‌فلاور</span>`;
$('#ticker').innerHTML=[0,1].map(()=>BRANCHES.filter(b=>!b.soon).map(b=>`<span>${b.name}</span><i></i>`).join('')).join('');
function start(){
 HERO=new Viewer($('#heroArt'),{auto:!REDUCE,stagger:true,yaw:.35,pitch:.22,fov:26,focusMode:'all',breathe:true,parallax:true,motes:90});
 HERO.setConfig(prep(def('bouquet',{mainT:'rose',items:{rose:[9,1],lily:[3,1],gerbera:[3,0],carn:[4,2],baby:[4,0]},paper:{c:2,style:'matte'},ribbon:{on:true,c:1,style:'organza',w:'L'},jute:false,green:{k:'euc',n:3},card:{on:false,m:'kraft',text:'',photo:null},bloom:'open',seed:12,size:'L'})));
 STUDIO=new Viewer($('#stage'),{stagger:false,yaw:.22,pitch:.28,fov:27,breathe:true,motes:60});
 commit();renderBranches();renderGrid();renderStepper();renderPanel();buildStudio(true);renderCart();onScroll();reveal(document.querySelector('main'));
 if(window.UFX)UFX.init();
}
function renderStepper(){$('#stepper').innerHTML=STEPS.map((s,i)=>`<li data-i="${i}" tabindex="0" role="button"><i>${fa(i+1)}</i><span>${s.t}</span></li>`).join('');$('#stepper').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const li=e.target.closest('li');if(li){e.preventDefault();step=+li.dataset.i;goStep()}}})}
const go=()=>{Promise.all([(document.fonts&&document.fonts.load?document.fonts.load('500 30px Vazirmatn').catch(()=>0):Promise.resolve()),(window.PH&&PH.ready)||0]).then(start,start)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
window.__app={get S(){return S},get branchObj(){return curBranch()},T$,fa,breakdown,analyze,desc,SIZES,MODELS,FL,BLOOM,ORDER,get step(){return step},smartDesign,set S(v){S=v},buildStudio,STEPS,goStep:i=>{step=i;goStep()},get STUDIO(){return STUDIO},get HERO(){return HERO},get thumb(){return thumb()},def,PRESETS,addToCart,get cart(){return cart},flowerIcon,BRANCHES,price,get DELIV(){return DELIV},clearCart(){cart=[];saveCart()},loadCfg(c){S=c;hist=[];hi=-1;commit();step=1;renderPanel();buildStudio(true);STUDIO.focus('flowers')},openCart};
})();
